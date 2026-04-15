const prisma = require('../prismaClient');

exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let whereClause = {};
    if (category) {
      whereClause.category = category;
    }

    if (search === 'deals') {
      const all = await prisma.product.findMany();
      return res.json(all.filter(p => p.id % 3 === 0));
    }
    
    if (search === 'new') {
      const all = await prisma.product.findMany({ orderBy: { id: 'desc' }, take: 10 });
      return res.json(all);
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50
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
