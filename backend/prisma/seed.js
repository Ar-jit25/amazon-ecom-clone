const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleProducts = [
  // Electronics
  {
    name: 'Echo Dot (5th Gen) | Smart speaker with Alexa',
    description: 'Our most popular smart speaker features a sleek design and improved audio for vibrant sound anywhere in your home. Control smart home devices, play music, get news updates and more with just your voice.',
    price: 49.99,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/71C3lbbeLsL._AC_SX679_.jpg',
    stock: 100
  },
  {
    name: 'Apple AirPods Pro (2nd Generation) with USB-C Charging',
    description: 'Rich, high-quality audio and voice. Active Noise Cancellation reduces unwanted background noise. Transparency mode lets you hear the world around you.',
    price: 189.00,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SX679_.jpg',
    stock: 50
  },
  {
    name: 'Logitech G502 HERO High Performance Wired Gaming Mouse',
    description: 'HERO 25K Sensor, 25,600 DPI, RGB, Adjustable Weights, 11 Programmable Buttons, On-Board Memory, PC / Mac',
    price: 39.99,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SX679_.jpg',
    stock: 120
  },
  {
    name: 'Samsung 65" Class Crystal UHD 4K Smart TV',
    description: 'Crystal Processor 4K. Auto Game Mode. Motion Xcelerator. Purcolor. Object Tracking Sound Lite. Alexa Built-In.',
    price: 527.99,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/91ysEPTqBvL._AC_SX679_.jpg',
    stock: 30
  },
  {
    name: 'Apple iPad (9th Generation) 10.2-inch Wi-Fi 64GB',
    description: 'Powerful A13 Bionic chip. 10.2-inch Retina display. Works with Apple Pencil and Smart Keyboard. 12MP ultra wide front camera.',
    price: 249.00,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/61jLGMBnDdL._AC_SX679_.jpg',
    stock: 75
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Up to 30-hour battery life with quick charging.',
    price: 278.00,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/51aXvjzcukL._AC_SX679_.jpg',
    stock: 60
  },
  {
    name: 'Kindle Paperwhite (16 GB) – Now with a larger display',
    description: 'Our most popular Kindle yet—now with a 7" display, adjustable warm light and up to 10 weeks of battery life.',
    price: 139.99,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/61PGcFfbotL._AC_SX679_.jpg',
    stock: 200
  },
  {
    name: 'Anker 65W USB C Charger, Compact Fast Charger',
    description: 'Charges MacBook Pro 13", iPhone 15, Galaxy S23, and more all from one port. GaN technology makes it 48% smaller than original Apple 61W charger.',
    price: 25.99,
    category: 'Electronics',
    imageUrl: 'https://m.media-amazon.com/images/I/41bENmNEjCL._AC_SX679_.jpg',
    stock: 300
  },
  // Books
  {
    name: 'The Pragmatic Programmer, 20th Anniversary Edition',
    description: 'Your journey to mastery. From journeyman to master — this classic is as relevant today as it was when first published.',
    price: 42.50,
    category: 'Books',
    imageUrl: 'https://m.media-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg',
    stock: 200
  },
  {
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies for forming good habits and breaking bad ones.',
    price: 14.99,
    category: 'Books',
    imageUrl: 'https://m.media-amazon.com/images/I/51-uspgqWIL._SX328_BO1,204,203,200_.jpg',
    stock: 500
  },
  {
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Robert C. Martin presents a revolutionary paradigm with Clean Code.',
    price: 35.99,
    category: 'Books',
    imageUrl: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    stock: 150
  },
  {
    name: 'Dune (Dune Chronicles, Book 1)',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides—heir to a noble family tasked with ruling an inhospitable world. Winner of Hugo and Nebula awards.',
    price: 11.49,
    category: 'Books',
    imageUrl: 'https://m.media-amazon.com/images/I/41nFHi1TSdL._SX305_BO1,204,203,200_.jpg',
    stock: 400
  },
  // Home
  {
    name: 'Amazon Basics Lightweight Microfiber Queen Bed Sheet Set - Bright White',
    description: 'Queen size - bright white. Includes flat sheet, fitted sheet, and 2 pillowcases. Made of 100% polyester microfiber for supple softness.',
    price: 19.99,
    category: 'Home',
    imageUrl: 'https://m.media-amazon.com/images/I/712XEB83eHL._AC_SX679_.jpg',
    stock: 80
  },
  {
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Quart',
    description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer.',
    price: 79.95,
    category: 'Home',
    imageUrl: 'https://m.media-amazon.com/images/I/71E1X7BdGAL._AC_SX679_.jpg',
    stock: 60
  },
  {
    name: 'Dyson V15 Detect Absolute Cordless Vacuum Cleaner',
    description: 'Laser Detect technology reveals microscopic dust. HEPA filtration captures 99.97% of particles. Up to 60 minutes of run time.',
    price: 699.99,
    category: 'Home',
    imageUrl: 'https://m.media-amazon.com/images/I/419-vU-TKBL._AC_SX679_.jpg',
    stock: 25
  },
  {
    name: 'Nespresso Vertuo Coffee and Espresso Machine by De\'Longhi',
    description: 'Brews 5 different cup sizes: Espresso, Double Espresso, Gran Lungo, Mug and Alto. Uses Centrifusion technology for a perfect brew.',
    price: 159.00,
    category: 'Home',
    imageUrl: 'https://m.media-amazon.com/images/I/61VXJFtTL9L._AC_SX679_.jpg',
    stock: 45
  },
  // Fashion
  {
    name: "Levi's Men's 514 Straight Fit Stretch Jeans",
    description: "Levi's most popular straight fit. The 514 has a natural seat, full thigh, and straight leg from knee to hem with a hint of stretch for all-day comfort.",
    price: 39.97,
    category: 'Fashion',
    imageUrl: 'https://m.media-amazon.com/images/I/71WNYfCHm0L._AC_UY879_.jpg',
    stock: 200
  },
  {
    name: 'Champion Men\'s Classic Graphic Tee',
    description: 'Premium quality cotton garment. Tagless neck label for comfort. Classic Champion logo embroidered on left sleeve.',
    price: 17.00,
    category: 'Fashion',
    imageUrl: 'https://m.media-amazon.com/images/I/71JLLxv7HvL._AC_UX679_.jpg',
    stock: 350
  },
  // Sports
  {
    name: 'Fit Simplify Resistance Loop Exercise Bands Set of 5',
    description: 'Set of 5 bands in varying resistance levels (light to X-Heavy). Comes with carrying bag, instruction guide, and online workout videos.',
    price: 10.95,
    category: 'Sports',
    imageUrl: 'https://m.media-amazon.com/images/I/71ixM6l1fDL._AC_SX679_.jpg',
    stock: 500
  },
  {
    name: 'Hydro Flask Standard Mouth Water Bottle 21 oz',
    description: 'TempShield double-wall vacuum insulation keeps beverages cold up to 24 hours and hot up to 12 hours. 18/8 pro-grade stainless steel.',
    price: 34.95,
    category: 'Sports',
    imageUrl: 'https://m.media-amazon.com/images/I/61VPp7FKRFL._AC_SX679_.jpg',
    stock: 220
  },
  {
    name: 'AmazonBasics Neoprene Coated Dumbbell Hand Weights, Set of 3 Pairs',
    description: 'Set of 3 pairs of neoprene coated dumbbells: 2, 3, and 5-lb weights. Tapered ends for easy access and tight rack formatting.',
    price: 46.09,
    category: 'Sports',
    imageUrl: 'https://m.media-amazon.com/images/I/71FUmMY4bxL._AC_SX679_.jpg',
    stock: 90
  },
  // Toys
  {
    name: 'LEGO Creator 3 in 1 Deep Sea Creatures Set',
    description: 'Build 3 different ocean creatures: a shark, crab or squid. Includes LEGO bricks in blue, white and orange for building underwater creations.',
    price: 15.99,
    category: 'Toys',
    imageUrl: 'https://m.media-amazon.com/images/I/71-s2fRDzFL._AC_SX679_.jpg',
    stock: 160
  },
  {
    name: 'Monopoly Board Game for Kids and Adults',
    description: 'The classic Monopoly property trading game. Buy properties, go to Jail, and bankrupt your opponents. 2-6 players, ages 8+.',
    price: 21.99,
    category: 'Toys',
    imageUrl: 'https://m.media-amazon.com/images/I/91G9hGFpbpL._AC_SX679_.jpg',
    stock: 130
  },
];

async function main() {
  console.log('Start seeding...');
  await prisma.orderItem.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  
  for (const product of sampleProducts) {
    const p = await prisma.product.create({ data: product });
    console.log(`Created product with id: ${p.id} - ${p.name}`);
  }
  console.log(`Seeding finished. Created ${sampleProducts.length} products.`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
