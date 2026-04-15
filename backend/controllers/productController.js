const prisma = require('../prismaClient');

exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }
    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive' // Requires Prisma schema for PG to support mode insensitive
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};
