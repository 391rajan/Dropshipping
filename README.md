# Ecommerce Full-Stack Project

A modern ecommerce platform built with Node.js, Express, MongoDB, and React.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database (already connected via .env)
- npm or yarn

### Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd ecommerce-backend
   npm install
   
   # Frontend
   cd ../ecommerce-frontend
   npm install
   ```

2. **Environment Configuration**
   - Ensure your `.env` file has `MONGO_URI` with your database connection string
   - The backend will automatically use your .env file

3. **Seed the Database**
   ```bash
   cd ecommerce-backend
   
   # First, create categories
   npm run seed:categories
   
   # Then, create products
   npm run seed
   ```

4. **Start Development**
   ```bash
   # Terminal 1 - Backend
   cd ecommerce-backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd ecommerce-frontend
   npm run dev
   ```

## 📊 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed products (requires categories first)
- `npm run seed:categories` - Seed categories

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production

## 🔧 API Endpoints

- **Products**: `/api/products`
- **Categories**: `/api/categories`
- **Auth**: `/api/auth`
- **Cart**: `/api/cart`
- **Wishlist**: `/api/wishlist`

## 🗄️ Database

- **MongoDB**: Connected via your .env file
- **Models**: Product, Category, User, Cart, Order
- **Seeding**: 20 products across 10+ categories

## 🎯 Features

- Product management with categories
- User authentication (JWT)
- Shopping cart functionality
- Wishlist system
- Product comparison
- Responsive design with Tailwind CSS

## 📁 Project Structure

```
ecommerce/
├── ecommerce-backend/          # Backend API
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Custom middleware
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── seeder.js              # Product seeder
│   ├── categorySeeder.js      # Category seeder
│   └── server.js              # Main server file
├── ecommerce-frontend/         # Frontend React app
└── README.md
```

## 🆘 Support

For issues or questions, check the console output or create an issue in the repository.
