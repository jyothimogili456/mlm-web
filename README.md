# MLM E-commerce Platform

A modern multi-level marketing e-commerce platform built with React and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Server Setup

1. **Install backend dependencies:**
   ```bash
   npm install express cors multer bcrypt jsonwebtoken
   ```

2. **Start the backend server:**
   ```bash
   node server.js
   ```
   
   The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Install frontend dependencies:**
   ```bash
   npm install
   ```

2. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3001`

## 📁 Project Structure

```
mlm-web-main/
├── src/                    # React frontend source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Page components
│   ├── context/           # React context providers
│   ├── api.ts             # API utility functions
│   └── ...
├── server.js              # Node.js backend server
├── package.json           # Frontend dependencies
└── README.md             # This file
```

## 🔧 API Endpoints

### Products
- `GET /product/all` - Get all products (public)
- `GET /product/:id` - Get specific product (public)

### Authentication
- `POST /user/register` - User registration
- `POST /user/login` - User login
- `GET /user/profile` - Get user profile (authenticated)

## 🛠️ Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Product Catalog** - Browse and search products
- **User Authentication** - Login/register functionality
- **Shopping Cart** - Add/remove items from cart
- **Wishlist** - Save favorite products
- **User Dashboard** - Profile management and order history
- **Referral System** - MLM referral tracking
- **Rewards & Offers** - Reward redemption system

## 🎨 UI Components

- Modern, clean design with gradient backgrounds
- Responsive navigation with mobile sidebar
- Product cards with action buttons
- Custom popup modals for notifications
- Loading states and error handling
- Pagination for data tables

## 🔒 Security

- JWT authentication for protected routes
- Password hashing with bcrypt
- CORS enabled for frontend-backend communication
- Input validation and sanitization

## 📱 Mobile Responsiveness

- Collapsible sidebar for mobile devices
- Responsive product grid
- Touch-friendly buttons and interactions
- Optimized layouts for different screen sizes

## 🚀 Deployment

### Backend
1. Set up environment variables
2. Deploy to your preferred hosting service (Heroku, AWS, etc.)
3. Update the `BASE_URL` in `src/api.ts` to point to your deployed backend

### Frontend
1. Build the production version: `npm run build`
2. Deploy the `build` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy coding! 🎉** 
