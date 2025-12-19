#!/bin/bash

echo "🚀 Deploying Bandera - Complete Social Media Platform"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi

# Initialize database if it doesn't exist
if [ ! -f "database.sqlite" ]; then
    print_status "Initializing database..."
    npm run init-db
    
    if [ $? -ne 0 ]; then
        print_error "Failed to initialize database"
        exit 1
    fi
    
    print_status "Database initialized successfully!"
    print_status "Admin user created: username: admin, password: admin123"
else
    print_warning "Database already exists, skipping initialization"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "resources/uploads" ]; then
    print_status "Creating uploads directory..."
    mkdir -p resources/uploads
fi

# Start the server
print_status "Starting Bandera server..."
print_status ""
print_status "🌐 Bandera will be available at:"
print_status "  • Local:   http://localhost:3000"
print_status "  • Network: http://0.0.0.0:3000"
print_status ""
print_status "📱 Features available:"
print_status "  • User registration and login"
print_status "  • Photo sharing and cultural content"
print_status "  • Like and comment system"
print_status "  • User profiles with achievements"
print_status "  • Cultural content discovery"
print_status ""
print_status "🔐 Default admin account:"
print_status "  • Username: admin"
print_status "  • Password: admin123"
print_status ""
print_status "Press Ctrl+C to stop the server"
print_status "======================================================"

# Start the server
npm start