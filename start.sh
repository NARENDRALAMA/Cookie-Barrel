#!/bin/bash

# Cookie Barrel - Startup Script
echo "🍪 Starting Cookie Barrel Digital Ordering System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   - Local: mongod"
    echo "   - Docker: docker run -d -p 27017:27017 mongo"
    echo "   - MongoDB Atlas: Update MONGODB_URI in .env.local"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating environment file..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please update with your MongoDB URI and JWT secret"
fi

# Start the development server
echo "🚀 Starting Next.js development server..."
echo "📱 Web app: http://localhost:3000"
echo "🔗 API docs: http://localhost:3000/api/health"
echo "📖 Mobile API guide: ./MOBILE_API_GUIDE.md"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev

