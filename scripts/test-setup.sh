#!/bin/bash

# Test Setup Script for NestJS React Router
# This script validates that the application can be set up and run successfully

set -e

echo "🚀 Testing NestJS React Router Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo ""
echo "1. Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        print_status 0 "Node.js $(node --version) is installed"
    else
        print_status 1 "Node.js version 18+ required, found $(node --version)"
    fi
else
    print_status 1 "Node.js is not installed"
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version | cut -d'.' -f1)
    if [ "$PNPM_VERSION" -ge 9 ]; then
        print_status 0 "pnpm $(pnpm --version) is installed"
    else
        print_status 1 "pnpm version 9+ required, found $(pnpm --version)"
    fi
else
    print_status 1 "pnpm is not installed"
fi

# Check Docker
if command -v docker &> /dev/null; then
    print_status 0 "Docker is installed"
else
    print_warning "Docker is not installed - you'll need PostgreSQL and Redis running locally"
fi

echo ""
echo "2. Installing dependencies..."

# Install dependencies
pnpm install
print_status $? "Dependencies installed successfully"

echo ""
echo "3. Setting up environment..."

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    print_status 0 "Environment file created from .env.example"
else
    print_status 0 "Environment file already exists"
fi

echo ""
echo "4. Starting database services..."

# Check if ports are available
if lsof -ti:5432 &> /dev/null; then
    print_warning "Port 5432 is already in use - using existing PostgreSQL"
else
    print_warning "Port 5432 is free - you may need to start PostgreSQL"
fi

if lsof -ti:6379 &> /dev/null; then
    print_warning "Port 6379 is already in use - using existing Redis"
else
    print_warning "Port 6379 is free - you may need to start Redis"
fi

# Try to start Docker services if Docker is available
if command -v docker &> /dev/null; then
    echo "Attempting to start Docker services..."
    docker compose up -d postgres redis 2>/dev/null || print_warning "Could not start Docker services (ports may be in use)"
    
    # Wait for services to be ready
    echo "Waiting for services to be ready..."
    sleep 10
fi

echo ""
echo "5. Setting up database..."

# Create database if it doesn't exist
psql postgres://postgres:postgres@localhost:5432/postgres -c "CREATE DATABASE appdb;" 2>/dev/null || echo "Database might already exist"

# Push database schema
pnpm db:push
print_status $? "Database schema pushed successfully"

echo ""
echo "6. Testing application startup..."

# Start the application in background
echo "Starting development server..."
pnpm dev &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 15

# Test if server is responding
if curl -s http://localhost:3000 > /dev/null; then
    print_status 0 "Application is running on http://localhost:3000"
    
    # Test API endpoint
    if curl -s http://localhost:3000/api/health | grep -q "ok"; then
        print_status 0 "API health endpoint is working"
    else
        print_status 1 "API health endpoint is not responding"
    fi
else
    print_status 1 "Application failed to start"
fi

echo ""
echo "7. Cleanup..."

# Kill the server
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "🎉 Setup test completed successfully!"
echo ""
echo "To start the application:"
echo "  pnpm dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
