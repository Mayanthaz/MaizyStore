#!/bin/bash

echo "🚀 Starting Deployment..."

# Pul latest changes
git pull origin main

# Install Backend Dependencies
npm install

# Build Frontend
echo "📦 Building Frontend..."
npm run build

# Restart PM2 process
echo "🔄 Restarting Server..."
pm2 restart maizy-store || pm2 start server.js --name "maizy-store"

echo "✅ Deployment Complete!"
