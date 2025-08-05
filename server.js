const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

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
        url: 'http://localhost:3000',
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Products API: http://localhost:${PORT}/product/all`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
}); 