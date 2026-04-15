const prisma = require('../prismaClient');

exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;
    
    // items is an array of { productId, quantity, price }
    
    const order = await prisma.order.create({
      data: {
        totalAmount,
        shippingAddress,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Optionally clear cart after placing order
    await prisma.cartItem.deleteMany({});

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
