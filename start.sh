#!/bin/bash

echo "🚀 Starting Bandera - Ethiopian Social Media Platform"
echo "======================================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database exists
if [ ! -f "database.sqlite" ]; then
    echo "🗄️  Initializing database..."
    npm run init-db
fi

echo "🌐 Starting server..."
echo ""
echo "Bandera will be available at:"
echo "  • Local:   http://localhost:3000"
echo "  • Network: http://0.0.0.0:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "======================================================"

npm start