#!/bin/bash
set -e  # Exit on error

echo "=== Starting backend build ==="
cd backend
echo "=== Installing dependencies ==="
npm install
echo "=== Running build ==="
npm run build
echo "=== Build complete ==="
cd ..
echo "=== Listing backend/dist contents ==="
ls -la backend/dist