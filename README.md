# Tribal Craft - E-commerce Platform for Traditional Indian Crafts

![Tribal Craft](https://img.shields.io/badge/Platform-E--commerce-blue) ![React](https://img.shields.io/badge/Frontend-React-61dafb) ![Node.js](https://img.shields.io/badge/Backend-Node.js-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-4db33d)

A full-stack e-commerce platform dedicated to promoting and selling authentic tribal crafts from various regions of India. This platform connects traditional artisans with customers worldwide, preserving cultural heritage while supporting local communities.

## 🌟 Features

### For Customers
- **Browse Authentic Crafts**: Explore a curated collection of traditional tribal art and crafts
- **Detailed Product Information**: View comprehensive details including artist information, regional origin, and cultural significance
- **Shopping Cart & Checkout**: Seamless shopping experience with secure checkout process
- **Order Management**: Track orders and view order history
- **User Authentication**: Secure registration and login system

### For Artisans/Sellers
- **Craft Listing**: Submit your traditional crafts for review and approval
- **Profile Management**: Manage seller information and contact details
- **Sales Tracking**: Monitor your craft sales and customer feedback

### For Administrators
- **Craft Approval**: Review and approve/reject craft submissions
- **User Management**: Manage user accounts and permissions
- **Dashboard Analytics**: Monitor platform performance and sales

## 🎨 Featured Craft Categories

- **Warli Art** (Maharashtra) - Geometric tribal patterns
- **Madhubani Painting** (Bihar) - Mythological folk art
- **Gond Art** (Madhya Pradesh) - Nature-inspired tribal art
- **Pattachitra** (Odisha) - Traditional cloth paintings
- **Kalamkari** (Andhra Pradesh) - Hand-painted textiles
- **Bhil Art** (Rajasthan) - Dot painting techniques
- **Mekhla Chandar** (Assam) - Traditional Assamese attire
- **Cane & Bamboo Crafts** (North-East India) - Sustainable daily-use items
- **Pottery** (Manipur) - Traditional tribal pottery
- **Patola** (Gujarat) - Double Ikat weaving

## 🚀 Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system
- **CSS3** - Styling and responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Tribal_Craft/
├── tribalcraft-backend/          # Backend API
│   ├── middleware/               # Custom middleware
│   ├── models/                   # Database models
│   │   ├── User.js              # User schema
│   │   ├── Craft.js             # Craft schema
│   │   ├── Cart.js              # Cart schema
│   │   └── Order.js             # Order schema
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── crafts.js            # Craft management routes
│   │   ├── cart.js              # Shopping cart routes
│   │   └── checkout.js          # Checkout and orders
│   ├── uploads/                  # File uploads directory
│   ├── server.js                # Main server file
│   └── package.json             # Backend dependencies
├── tribalcraft-frontend/         # Frontend React app
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.js        # Navigation component
│   │   │   └── Footer.js        # Footer component
│   │   ├── context/             # React context
│   │   │   └── AuthContext.js   # Authentication context
│   │   ├── pages/               # Page components
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── BuyCraft.js      # Browse crafts
│   │   │   ├── SellCraft.js     # Submit crafts
│   │   │   ├── Cart.js          # Shopping cart
│   │   │   ├── Checkout.js      # Checkout process
│   │   │   ├── Login.js         # User login
│   │   │   ├── SignUp.js        # User registration
│   │   │   ├── AdminDashboard.js # Admin panel
│   │   │   ├── Orders.js        # Order history
│   │   │   └── ProductDetails.js # Product details
│   │   └── App.js               # Main app component
│   └── package.json             # Frontend dependencies
└── README.md                    # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Deployment

### Render.com Deployment

1. **Connect your GitHub repository to Render**
2. **Create two web services:**
   - **Backend Service:**
     - Build Command: `npm run build-backend`
     - Start Command: `npm start`
     - Environment: `Node`
   - **Frontend Service:**
     - Build Command: `npm run build-frontend`
     - Publish Directory: `tribalcraft-frontend/build`
     - Environment: `Static Site`

3. **Environment Variables for Backend:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

### Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd tribalcraft-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/tribalcraft
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. **Start the backend server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd tribalcraft-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Crafts
- `GET /api/crafts/approved` - Get approved crafts
- `POST /api/crafts` - Submit new craft (authenticated)
- `GET /api/crafts/pending` - Get pending crafts (admin)
- `PUT /api/crafts/:id/approve` - Approve craft (admin)
- `PUT /api/crafts/:id/reject` - Reject craft (admin)

### Cart & Orders
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/checkout` - Process checkout
- `GET /api/checkout/orders` - Get user orders

## 🎯 Usage

### For Customers
1. **Browse Crafts**: Visit the home page to explore featured tribal crafts
2. **Create Account**: Register to access full features
3. **Add to Cart**: Select crafts and add them to your shopping cart
4. **Checkout**: Complete your purchase through the secure checkout process
5. **Track Orders**: View your order history and track current orders

### For Artisans
1. **Register**: Create an account as a seller
2. **Submit Crafts**: Use the "Sell Craft" page to submit your traditional crafts
3. **Provide Details**: Include comprehensive information about your craft and cultural significance
4. **Await Approval**: Admin will review and approve your submissions
5. **Manage Sales**: Monitor your approved crafts and customer interactions

### For Administrators
1. **Admin Access**: Login with admin credentials
2. **Review Submissions**: Approve or reject craft submissions
3. **Manage Users**: Monitor user accounts and activities
4. **Platform Analytics**: View sales and user engagement metrics

## 🤝 Contributing

We welcome contributions to help preserve and promote traditional Indian tribal crafts!

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Traditional Artisans**: For preserving and sharing their cultural heritage
- **Indian Tribal Communities**: For their rich artistic traditions
- **Open Source Community**: For providing excellent tools and libraries

## 📞 Support

For support, questions, or feature requests:
- Create an issue in the GitHub repository
- Contact the development team
- Visit our support page on the platform

## 🔮 Future Enhancements

- **Multi-language Support**: Support for regional Indian languages
- **Mobile App**: Native mobile applications for iOS and Android
- **Payment Integration**: Multiple payment gateway integrations
- **Artisan Stories**: Detailed profiles and stories of traditional artisans
- **Virtual Tours**: 360-degree views of craft-making processes
- **AR Features**: Augmented reality to visualize crafts in real environments

---

**Tribal Craft** - Bridging traditional heritage with modern technology, one craft at a time. 🎨✨
