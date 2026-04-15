const prisma = require('../prismaClient');

exports.getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      include: { product: true }
    });
    // Need to update cart model to include relation to product or just fetch it
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Check if item already exists in cart mapping
    let cartItem = await prisma.cartItem.findUnique({
      where: { productId: parseInt(productId) }
    });

    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + (quantity || 1) }
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          productId: parseInt(productId),
          quantity: quantity || 1
        }
      });
    }

    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.update({
      where: { productId: parseInt(productId) },
      data: { quantity: parseInt(quantity) }
    });

    res.json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    await prisma.cartItem.delete({
      where: { productId: parseInt(productId) }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};
