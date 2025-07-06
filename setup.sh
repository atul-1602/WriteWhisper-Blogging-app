#!/bin/bash

echo "🚀 Setting up WriteWhisper Blog Platform..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB is not installed or not in PATH. Please install MongoDB."
    print_warning "You can download it from: https://www.mongodb.com/try/download/community"
fi

# Setup Backend
print_status "Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found!"
    exit 1
fi

print_status "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed successfully!"
else
    print_error "Failed to install backend dependencies!"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/writewhisper
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
EOF
    print_success ".env file created!"
else
    print_status ".env file already exists"
fi

cd ..

# Setup Frontend
print_status "Setting up frontend..."
cd frontened

if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found!"
    exit 1
fi

print_status "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed successfully!"
else
    print_error "Failed to install frontend dependencies!"
    exit 1
fi

cd ..

echo ""
print_success "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start MongoDB server (if not already running)"
echo "2. Open a terminal and run: cd backend && npm run dev"
echo "3. Open another terminal and run: cd frontened && npm run dev"
echo "4. Open your browser and go to: http://localhost:3000"
echo ""
echo "🔧 Available commands:"
echo "  Backend:"
echo "    npm run dev     - Start development server"
echo "    npm start       - Start production server"
echo ""
echo "  Frontend:"
echo "    npm run dev     - Start development server"
echo "    npm run build   - Build for production"
echo "    npm run preview - Preview production build"
echo ""
print_warning "⚠️  Make sure MongoDB is running before starting the backend server!"
echo ""
print_success "Happy coding! 🚀" 