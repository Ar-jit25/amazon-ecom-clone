const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();
const API_URL = 'https://dummyjson.com/products?limit=25';
const imagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'api');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${res.statusCode} for ${url}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Fetching products from API: ${API_URL}`);
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`API fetch failed with status ${response.status}`);
  
  const data = await response.json();
  const allProducts = data.products;
  const currentDbProducts = await prisma.product.findMany();
  const existingNames = new Set(currentDbProducts.map(p => p.name.toLowerCase()));
  
  let addedCount = 0;
  
  for (let i = 0; i < allProducts.length; i++) {
    const item = allProducts[i];
    
    // Check duplicates
    if (existingNames.has(item.title.toLowerCase())) {
       console.log(`Skipping duplicate: ${item.title}`);
       continue;
    }
    
    if (addedCount >= 20) break; // We just need about 20 since first pass gets 50
    
    const desc = item.description || `High quality ${item.title}`;
    
    let localImageUrl = '';
    const srcImageUrl = item.thumbnail || (item.images && item.images.length > 0 ? item.images[0] : null);
    
    // Download image
    if (srcImageUrl) {
      const ext = path.extname(new URL(srcImageUrl).pathname) || '.jpg';
      const localFilename = `api-dummyprod-${i}${ext}`;
      const dest = path.join(imagesDir, localFilename);
      
      console.log(`Downloading image for ${item.title}...`);
      try {
        await downloadImage(srcImageUrl, dest);
        localImageUrl = `/images/api/${localFilename}`;
      } catch (err) {
        console.error(`Error downloading image for ${item.title}: ${err.message}`);
        const text = encodeURIComponent(item.title.substring(0, 20));
        localImageUrl = `https://placehold.co/600x600/f3f3f3/333333.png?text=${text}`;
      }
    } else {
        const text = encodeURIComponent(item.title.substring(0, 20));
        localImageUrl = `https://placehold.co/600x600/f3f3f3/333333.png?text=${text}`;
    }

    const newProduct = {
      name: item.title,
      description: desc,
      price: item.price,
      category: item.category || 'General',
      imageUrl: localImageUrl,
      stock: item.stock || 50
    };

    await prisma.product.create({
      data: newProduct
    });
    addedCount++;
    console.log(`Inserted into DB: [${addedCount}/20] ${newProduct.name}`);
  }
}

main()
  .then(async () => {
    console.log('DummyJSON products successfully appended!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
