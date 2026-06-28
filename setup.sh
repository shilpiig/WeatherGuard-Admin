#!/bin/bash

# WeatherGuard Admin - Quick Start Script

echo "🚀 WeatherGuard Admin - Development Setup"
echo "=========================================="

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check for Docker (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker found: $(docker --version)"
    read -p "Would you like to start MongoDB using Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🐳 Starting MongoDB container..."
        docker-compose up -d mongodb
        echo "✅ MongoDB is running on mongodb://localhost:27017"
        sleep 3
    fi
else
    echo "⚠️  Docker not found. Please ensure MongoDB is running locally."
fi

# Install dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd api
npm install
cd ..

echo ""
echo "📦 Installing frontend dependencies..."
cd admin
npm install
cd ..

# Copy environment files
echo ""
echo "⚙️  Setting up environment files..."
if [ ! -f "api/.env" ]; then
    cp api/.env.example api/.env
    echo "✅ Created api/.env (please update with your credentials)"
fi

if [ ! -f "admin/.env" ]; then
    echo "VITE_API_URL=http://localhost:3001" > admin/.env
    echo "✅ Created admin/.env"
fi

echo ""
echo "=========================================="
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update api/.env with your OAuth credentials"
echo "2. Start the backend: cd api && npm run dev"
echo "3. In another terminal, start the frontend: cd admin && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "Documentation: See README.md for detailed setup instructions"
echo "=========================================="
