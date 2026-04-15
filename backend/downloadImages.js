const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();
const imagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    const client = url.startsWith('https') ? https : http;
    client.get(url, options, (res) => {
      // follow redirects for placehold.co
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Status ${res.statusCode} for ${url}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', reject);
  });
}

function getFallbackUrl(productName) {
  // placehold.co works without API keys and supports custom text
  const text = encodeURIComponent(productName.substring(0, 20));
  return `https://placehold.co/600x600/f3f3f3/333333.png?text=${text}`;
}

async function main() {
  console.log('Fetching products from database...');
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products.`);

  for (const product of products) {
    if (product.imageUrl) {
      const isExternalUrl = product.imageUrl.startsWith('http');
      // If it's already a local URL, skip if file exists
      if (!isExternalUrl) {
         const existingPath = path.join(__dirname, '..', 'frontend', 'public', product.imageUrl);
         if (fs.existsSync(existingPath)) {
            continue;
         }
      }

      // We need to resolve what to download.
      // If it was already set to a local failed download, let's use the DB's product.name
      const ext = '.jpg';
      const localFilename = `product-${product.id}${ext}`;
      const dest = path.join(imagesDir, localFilename);
      
      let downloadUrl = isExternalUrl ? product.imageUrl : getFallbackUrl(product.name);
      
      console.log(`Downloading ${downloadUrl} to ${localFilename}...`);
      try {
        await downloadImage(downloadUrl, dest);
      } catch (err) {
        console.error(`Error downloading original image for product ${product.id}:`, err.message);
        console.log(`Fallback to placeholder...`);
        try {
           await downloadImage(getFallbackUrl(product.name), dest);
        } catch (fbErr) {
           console.error(`Fallback also failed...`, fbErr.message);
           continue;
        }
      }

      // Update product in database
      const localUrl = `/images/${localFilename}`;
      if (product.imageUrl !== localUrl) {
        await prisma.product.update({
          where: { id: product.id },
          data: { imageUrl: localUrl }
        });
        console.log(`Updated product ${product.id} image to ${localUrl}`);
      } else {
        console.log(`Product ${product.id} already pointing to local file.`);
      }
    }
  }
}

main()
  .then(async () => {
    console.log('Finished downloading all images and updating database.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
