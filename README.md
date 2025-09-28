# 🍪 Cookie Barrel - Digital Ordering System

A modern, responsive web application for The Cookie Barrel's digital ordering system, featuring WhatsApp integration and comprehensive order management.

## 🚀 Features

### Customer Features

- **User Authentication**: Secure registration and login system
- **Product Browsing**: Browse cookies with filtering and search capabilities
- **Shopping Cart**: Add, remove, and manage items with quantity controls
- **Order Placement**: Complete checkout process with promo codes
- **Order Tracking**: Real-time order status updates
- **WhatsApp Integration**: Receive order updates and support via WhatsApp

### Admin Features

- **Dashboard Overview**: Key metrics and statistics
- **Order Management**: View, update, and manage all orders
- **Customer Management**: Manage customer accounts and data
- **Real-time Updates**: Monitor order progress and status changes

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cookie-barrel-ordering
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navbar.jsx     # Navigation component
├── context/            # React Context for state management
│   ├── AuthContext.jsx # Authentication state
│   └── CartContext.jsx # Shopping cart state
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Menu.jsx        # Product catalog
│   ├── Cart.jsx        # Shopping cart
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   ├── OrderTracking.jsx # Order status tracking
│   └── AdminDashboard.jsx # Admin panel
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## 🎯 Key Features Implementation

### WhatsApp Integration

- Simulated WhatsApp Business API integration
- Order confirmation messages
- Real-time status updates
- Customer support chat integration

### Order Management

- Complete order lifecycle tracking
- Status updates (Ordered → Preparing → Ready → Delivered)
- Admin order management interface
- Customer order history

### User Experience

- Responsive design for all devices
- Intuitive navigation and user flow
- Modern UI with smooth animations
- Accessibility considerations

## 🔐 Demo Accounts

### Regular User

- **Email**: Any email address
- **Password**: Any password (6+ characters)

### Admin User

- **Email**: Any email containing "admin"
- **Password**: Any password (6+ characters)

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎨 Customization

### Colors

The application uses a custom color palette defined in `tailwind.config.js`:

- **Primary**: Orange tones for main actions
- **Cookie**: Brown tones for cookie-themed elements
- **Standard**: Gray scale for text and backgrounds

### Styling

- Custom CSS classes in `src/index.css`
- Tailwind utility classes for rapid development
- Consistent spacing and typography system

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Static Hosting

The built files in the `dist/` folder can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration for code quality
- Consistent formatting and naming conventions
- Component-based architecture
- Proper error handling and validation

## 📊 Future Enhancements

- **Backend Integration**: Connect to real API endpoints
- **Payment Processing**: Integrate payment gateways
- **Inventory Management**: Real-time stock tracking
- **Analytics**: Advanced reporting and insights
- **Mobile App**: React Native mobile application
- **Real-time Chat**: Live customer support
- **Push Notifications**: Browser and mobile notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Narendra Lama** - Backend and Cloud Integration
- **Pratik Bhandari** - Mobile App Development
- **Sagar Gurung** - WhatsApp & POS Integration

## 📞 Support

For support or questions about this project:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a prototype/demo application. In production, you would need to:

- Implement proper backend services
- Add real database connections
- Integrate with actual WhatsApp Business API
- Implement proper security measures
- Add comprehensive testing
- Set up monitoring and logging



