const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3001; // Pin mlm-web to port 3001

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MLM E-commerce API',
      version: '1.0.0',
      description: 'API documentation for MLM E-commerce Platform',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            productName: { type: 'string', example: 'Premium Health Supplement' },
            productCount: { type: 'integer', example: 50 },
            productCode: { type: 'integer', example: 1001 },
            productPrice: { type: 'number', example: 1500 },
            description: { type: 'string', example: 'High-quality health supplement' },
            image: { type: 'string', example: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
            photoUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
            productStatus: { type: 'string', example: 'AVAILABLE' },
            category: { type: 'string', example: 'Health & Wellness' },
            rating: { type: 'number', example: 4.5 },
            mrp: { type: 'number', example: 1800 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 200 },
            message: { type: 'string', example: 'Success' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
          }
        }
      }
    }
  },
  apis: ['./server.js']
};

const specs = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    statusCode: 200,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/product/all',
      cart: '/cart/{userId}',
      wishlist: '/wishlist/{userId}',
      docs: '/api-docs'
    }
  });
});

// Sample products data
let products = [
  {
    id: 1,
    productName: "Premium Health Supplement",
    productCount: 50,
    productCode: 1001,
    productPrice: 1500,
    description: "High-quality health supplement with natural ingredients",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
    photoUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
    productStatus: "AVAILABLE",
    category: "Health & Wellness",
    rating: 4.5,
    mrp: 1800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    productName: "Organic Wellness Tea",
    productCount: 75,
    productCode: 1002,
    productPrice: 800,
    description: "Organic tea blend for daily wellness and relaxation",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
    photoUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
    productStatus: "AVAILABLE",
    category: "Health & Wellness",
    rating: 4.2,
    mrp: 1000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    productName: "Smart Fitness Tracker",
    productCount: 30,
    productCode: 1003,
    productPrice: 2500,
    description: "Advanced fitness tracker with heart rate monitoring",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop",
    photoUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop",
    productStatus: "AVAILABLE",
    category: "Electronics",
    rating: 4.7,
    mrp: 3000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 4,
    productName: "Natural Face Cream",
    productCount: 60,
    productCode: 1004,
    productPrice: 1200,
    description: "Natural face cream with organic ingredients",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
    photoUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
    productStatus: "AVAILABLE",
    category: "Health & Wellness",
    rating: 4.3,
    mrp: 1500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 5,
    productName: "Wireless Bluetooth Headphones",
    productCount: 40,
    productCode: 1005,
    productPrice: 1800,
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    photoUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    productStatus: "AVAILABLE",
    category: "Electronics",
    rating: 4.6,
    mrp: 2200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * @swagger
 * /product/all:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all available products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Products fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 */
app.get('/product/all', (req, res) => {
  res.json({
    statusCode: 200,
    message: "Products fetched successfully",
    data: products
  });
});

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     description: Retrieve detailed information about a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Product fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Product not found
 *                 data:
 *                   type: null
 *       500:
 *         description: Internal server error
 */
app.get('/product/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      statusCode: 404,
      message: "Product not found",
      data: null
    });
  }
  
  res.json({
    statusCode: 200,
    message: "Product fetched successfully",
    data: product
  });
});

// Mock data for cart and wishlist
let carts = new Map(); // userId -> cart items
let wishlists = new Map(); // userId -> wishlist items

/**
 * @swagger
 * /cart/add/{userId}:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product to user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: Product ID to add
 *               quantity:
 *                 type: integer
 *                 description: Quantity to add
 *                 default: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Product not found
 */
app.post('/cart/add/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { productId, quantity = 1 } = req.body;
  
  if (!productId || !quantity) {
    return res.status(400).json({
      statusCode: 400,
      message: "Product ID and quantity are required",
      data: null
    });
  }
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      statusCode: 404,
      message: "Product not found",
      data: null
    });
  }
  
  if (!carts.has(userId)) {
    carts.set(userId, []);
  }
  
  const userCart = carts.get(userId);
  const existingItem = userCart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    userCart.push({
      id: Date.now(),
      productId,
      quantity,
      product: product
    });
  }
  
  res.json({
    statusCode: 200,
    message: "Item added to cart successfully",
    data: userCart
  });
});

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Get user's cart
 *     description: Retrieve all items in user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 */
app.get('/cart/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userCart = carts.get(userId) || [];
  
  res.json({
    statusCode: 200,
    message: "Cart retrieved successfully",
    data: userCart
  });
});

/**
 * @swagger
 * /cart/remove/{userId}/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific item from user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Item not found in cart
 */
app.delete('/cart/remove/:userId/:itemId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const itemId = parseInt(req.params.itemId);
  
  if (!carts.has(userId)) {
    return res.status(404).json({
      statusCode: 404,
      message: "Cart not found",
      data: null
    });
  }
  
  const userCart = carts.get(userId);
  const itemIndex = userCart.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      statusCode: 404,
      message: "Item not found in cart",
      data: null
    });
  }
  
  userCart.splice(itemIndex, 1);
  
  res.json({
    statusCode: 200,
    message: "Item removed from cart successfully",
    data: userCart
  });
});

/**
 * @swagger
 * /wishlist/add/{userId}:
 *   post:
 *     summary: Add item to wishlist
 *     description: Add a product to user's wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: Product ID to add
 *     responses:
 *       200:
 *         description: Item added to wishlist successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Product not found
 */
app.post('/wishlist/add/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({
      statusCode: 400,
      message: "Product ID is required",
      data: null
    });
  }
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({
      statusCode: 404,
      message: "Product not found",
      data: null
    });
  }
  
  if (!wishlists.has(userId)) {
    wishlists.set(userId, []);
  }
  
  const userWishlist = wishlists.get(userId);
  const existingItem = userWishlist.find(item => item.productId === productId);
  
  if (existingItem) {
    return res.status(400).json({
      statusCode: 400,
      message: "Item already in wishlist",
      data: null
    });
  }
  
  userWishlist.push({
    id: Date.now(),
    productId,
    product: product
  });
  
  res.json({
    statusCode: 200,
    message: "Item added to wishlist successfully",
    data: userWishlist
  });
});

/**
 * @swagger
 * /wishlist/{userId}:
 *   get:
 *     summary: Get user's wishlist
 *     description: Retrieve all items in user's wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 */
app.get('/wishlist/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userWishlist = wishlists.get(userId) || [];
  
  res.json({
    statusCode: 200,
    message: "Wishlist retrieved successfully",
    data: userWishlist
  });
});

/**
 * @swagger
 * /wishlist/remove/{userId}/{itemId}:
 *   delete:
 *     summary: Remove item from wishlist
 *     description: Remove a specific item from user's wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Wishlist item ID
 *     responses:
 *       200:
 *         description: Item removed from wishlist successfully
 *       404:
 *         description: Item not found in wishlist
 */
app.delete('/wishlist/remove/:userId/:itemId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const itemId = parseInt(req.params.itemId);
  
  if (!wishlists.has(userId)) {
    return res.status(404).json({
      statusCode: 404,
      message: "Wishlist not found",
      data: null
    });
  }
  
  const userWishlist = wishlists.get(userId);
  const itemIndex = userWishlist.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    return res.status(404).json({
      statusCode: 404,
      message: "Item not found in wishlist",
      data: null
    });
  }
  
  userWishlist.splice(itemIndex, 1);
  
  res.json({
    statusCode: 200,
    message: "Item removed from wishlist successfully",
    data: userWishlist
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Products API: http://localhost:${PORT}/product/all`);
  console.log(`🛒 Cart API: http://localhost:${PORT}/cart/{userId}`);
  console.log(`❤️ Wishlist API: http://localhost:${PORT}/wishlist/{userId}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
}); 