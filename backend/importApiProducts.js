const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const prisma = new PrismaClient();
const API_URL = 'https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json';
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
  
  const allProducts = await response.json();
  const selectedProducts = allProducts.slice(0, 70); // Keep 70 products
  
  console.log(`Fetched ${allProducts.length} overall, keeping ${selectedProducts.length} products.`);

  // Clean DB
  console.log('Cleaning existing database logic...');
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  for (let i = 0; i < selectedProducts.length; i++) {
    const item = selectedProducts[i];
    
    // Some products from APIs might lack descriptions, fall back if needed
    const desc = item.description || `High quality ${item.name}`;
    
    let localImageUrl = '';
    // Download image
    if (item.image) {
      const ext = path.extname(new URL(item.image).pathname) || '.jpg';
      const localFilename = `api-prod-${i}${ext}`;
      const dest = path.join(imagesDir, localFilename);
      
      console.log(`Downloading image for ${item.name}...`);
      try {
        await downloadImage(item.image, dest);
        localImageUrl = `/images/api/${localFilename}`;
      } catch (err) {
        console.error(`Error downloading image for ${item.name}: ${err.message}`);
        // Fallback image if download fails
        const text = encodeURIComponent(item.name.substring(0, 20));
        localImageUrl = `https://placehold.co/600x600/f3f3f3/333333.png?text=${text}`;
      }
    }

    const newProduct = {
      name: item.name,
      description: desc,
      price: item.priceCents ? item.priceCents / 100 : 19.99,
      category: item.category || 'General',
      imageUrl: localImageUrl,
      stock: 50 // Default stock
    };

    await prisma.product.create({
      data: newProduct
    });
    console.log(`Inserted into DB: [${i+1}/${selectedProducts.length}] ${newProduct.name}`);
  }
}

main()
  .then(async () => {
    console.log('Database successfully re-seeded with API products and their images!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
