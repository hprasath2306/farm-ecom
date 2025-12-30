# Farm E-Commerce API

A Node.js/Express API for a farm-to-consumer e-commerce platform built with TypeScript and MongoDB.

## Features

- ✅ User authentication (JWT-based)
- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ MongoDB database with Mongoose
- ✅ Complete data models (User, Product, Order, Cart, Review, Category)
- ✅ Error handling middleware
- ✅ TypeScript support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/farm-ecommerce

   # JWT Secret (use a strong, random string in production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # CORS
   CORS_ORIGIN=http://localhost:3000

   # Node Environment
   NODE_ENV=development

   # Server Port (optional, default is 3000)
   PORT=3000
   ```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Build:**
```bash
npm run build
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get current user (Protected)
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
api/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── controllers/
│   │   └── auth.controller.ts   # Authentication logic
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # JWT authentication
│   │   └── error.middleware.ts  # Error handling
│   ├── models/
│   │   ├── user.model.ts        # User schema
│   │   ├── product.model.ts     # Product schema
│   │   ├── order.model.ts       # Order schema
│   │   ├── cart.model.ts        # Cart schema
│   │   ├── review.model.ts      # Review schema
│   │   └── category.model.ts    # Category schema
│   ├── routes/
│   │   └── auth.routes.ts       # Authentication routes
│   ├── utils/
│   │   └── jwt.ts               # JWT utilities
│   ├── index.ts                 # App entry point
│   └── server.ts                # Express server setup
├── package.json
├── tsconfig.json
└── nodemon.json
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## Next Steps

To complete the application, you can add:
- Product CRUD operations
- Cart management
- Order processing
- Review system
- Category management
- File upload for images
- Payment integration
- Email verification

## License

MIT

