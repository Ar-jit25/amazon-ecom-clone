const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const mapping = {
    'Electronics & Gadgets': 'Electronics',
    'Beauty & Personal Care': 'Beauty',
    'beauty': 'Beauty',
    'fragrances': 'Beauty',
    'Fashion & Apparel': 'Fashion',
    'Home & Kitchen': 'Home',
    'furniture': 'Home',
    'Health & Fitness': 'Sports',
    'groceries': 'Groceries'
  };

  const products = await prisma.product.findMany();
  let updatedCount = 0;

  for (const product of products) {
    if (mapping[product.category]) {
      await prisma.product.update({
        where: { id: product.id },
        data: { category: mapping[product.category] }
      });
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} products with clean categories.`);
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
