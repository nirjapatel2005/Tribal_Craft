# TribalCraft Backend API

Backend server for TribalCraft marketplace - connecting tribal artisans with buyers.

## Features
- User authentication (signup/login)
- Password hashing with bcrypt
- JWT token-based authentication
- MongoDB Atlas database
- RESTful API endpoints

## Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Update `.env` with your MongoDB Atlas credentials
5. Start server: `npm start`

## API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/crafts` - Get all crafts
- `POST /api/crafts/buy/:id` - Buy craft
- `POST /api/crafts/sell` - Sell craft

## Technologies
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- jsonwebtoken