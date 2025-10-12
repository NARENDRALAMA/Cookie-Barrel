# Cookie Barrel - Digital Ordering System

A modern, full-stack digital ordering system built with Next.js, featuring seamless frontend-backend integration and mobile app readiness.

## 🚀 Features

- **Full-Stack Next.js Application** - Unified frontend and backend in one project
- **Mobile-Ready API** - RESTful API designed for mobile app consumption
- **Real-time Order Tracking** - Track orders with status updates
- **User Authentication** - Secure JWT-based authentication
- **Shopping Cart** - Persistent cart with localStorage
- **Admin Dashboard** - Complete order management system
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **MongoDB Integration** - Scalable database with Mongoose ODM

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Mobile Ready

- **RESTful API** - Clean API design for mobile apps
- **CORS Support** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Comprehensive Documentation** - Mobile API guide included

## 📁 Project Structure

```
Cookie Barrel/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── products/           # Product management
│   │   ├── orders/             # Order management
│   │   └── health/             # Health check
│   ├── components/             # Reusable components
│   ├── context/                # React Context providers
│   ├── pages/                  # Page components
│   ├── globals.css             # Global styles
│   └── layout.js               # Root layout
├── lib/                        # Utility libraries
│   ├── models/                 # Database models
│   └── mongodb.js              # Database connection
├── MOBILE_API_GUIDE.md         # Mobile integration guide
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cookie-barrel
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   MONGODB_URI=mongodb://localhost:27017/cookie-barrel
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile App Integration

The API is designed to be mobile-friendly. Check out the comprehensive [Mobile API Guide](./MOBILE_API_GUIDE.md) for:

- Complete API documentation
- React Native integration examples
- Flutter integration examples
- Authentication flow
- Error handling patterns

### API Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🗄 Database Models

### User

- Authentication and profile information
- Address management
- Role-based access (customer/admin)

### Product

- Menu items with categories
- Pricing and inventory
- Images and descriptions
- Nutritional information

### Order

- Order management and tracking
- Payment status
- Delivery information
- Order history

## 🔐 Authentication

The system uses JWT tokens for authentication:

1. **Register/Login** - Get JWT token
2. **Include token** - Add to Authorization header
3. **Protected routes** - Automatically verified

```javascript
// Example API call with authentication
const response = await fetch("/api/orders", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

## 🎨 Customization

### Styling

- Modify `app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Use Tailwind utility classes throughout components

### API Endpoints

- Add new endpoints in `app/api/`
- Follow RESTful conventions
- Include proper error handling

### Database

- Modify models in `lib/models/`
- Add new fields or relationships
- Update validation rules

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Other Platforms

- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products

- `GET /api/products` - Get products (with filters)
- `POST /api/products` - Create product (admin)

### Orders

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order status

### Health

- `GET /api/health` - API health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support or questions:

- Check the [Mobile API Guide](./MOBILE_API_GUIDE.md)
- Review the API documentation
- Open an issue on GitHub

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Payment gateway integration
- [ ] WhatsApp integration for order updates
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Push notifications for mobile apps

---

Built with ❤️ for modern digital ordering systems
