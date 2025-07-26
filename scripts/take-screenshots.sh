#!/usr/bin/env bash

# Links2Go Screenshot Helper Script
# This script helps contributors take consistent screenshots

set -e

SCREENSHOT_DIR="docs/screenshots"
REQUIRED_SCREENSHOTS=(
    "main-interface.png"
    "analytics-dashboard.png" 
    "qr-code-modal.png"
    "terminal-experience.png"
)

echo "🖥️  Links2Go Screenshot Helper"
echo "================================"
echo ""

# Check if application is running
if ! curl -s http://localhost:5173 >/dev/null 2>&1; then
    echo "❌ Frontend not running on http://localhost:5173"
    echo ""
    echo "Please start the application first:"
    echo "  nix develop"
    echo "  dev"
    echo ""
    exit 1
fi

if ! curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo "❌ Backend not running on http://localhost:3001"
    echo ""
    echo "Please start the application first:"
    echo "  nix develop"
    echo "  dev"
    echo ""
    exit 1
fi

echo "✅ Application is running!"
echo ""

# Create screenshot directory if it doesn't exist
mkdir -p "$SCREENSHOT_DIR"

echo "📸 Screenshot Instructions:"
echo ""
echo "The application is ready at: http://localhost:5173"
echo ""
echo "Required screenshots:"
for screenshot in "${REQUIRED_SCREENSHOTS[@]}"; do
    if [ -f "$SCREENSHOT_DIR/$screenshot" ]; then
        echo "  ✅ $screenshot (exists)"
    else
        echo "  📋 $screenshot (needed)"
    fi
done

echo ""
echo "📋 Screenshot Checklist:"
echo ""
echo "1. 🖥️  Main Interface (main-interface.png)"
echo "   - Go to http://localhost:5173"
echo "   - Ensure [SHORTEN] tab is active"
echo "   - Show full CRT monitor with ASCII logo"
echo "   - Capture the URL input form"
echo ""
echo "2. 📊 Analytics Dashboard (analytics-dashboard.png)"  
echo "   - First, create a short URL and click it a few times"
echo "   - Click [ANALYTICS] tab"
echo "   - Enter a short code with data"
echo "   - Capture the dashboard with charts and tables"
echo ""
echo "3. 📱 QR Code Modal (qr-code-modal.png)"
echo "   - Create a shortened URL"
echo "   - Click the QR code icon"
echo "   - Capture the modal with QR code and buttons"
echo ""
echo "4. 🎨 Terminal Experience (terminal-experience.png)"
echo "   - Focus on retro aesthetic elements"
echo "   - Ensure scanlines and glow are visible"
echo "   - Capture the nostalgic CRT monitor feel"
echo ""

echo "📖 Detailed instructions: docs/SCREENSHOTS.md"
echo ""

# Check if screenshots exist and offer to open browser
if command -v open >/dev/null 2>&1; then
    echo "🌐 Open application in browser? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        open "http://localhost:5173"
    fi
elif command -v xdg-open >/dev/null 2>&1; then
    echo "🌐 Open application in browser? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        xdg-open "http://localhost:5173"
    fi
fi

echo ""
echo "💡 Tips:"
echo "  - Use 100% browser zoom"
echo "  - Take high-resolution screenshots (1920x1080+)"
echo "  - Save as PNG format"
echo "  - Place files in $SCREENSHOT_DIR/"
echo ""
echo "After taking screenshots, run:"
echo "  git add $SCREENSHOT_DIR/"
echo "  git commit -m \"docs: add application screenshots\""
echo ""

# Show current status
echo "📁 Current screenshot directory contents:"
if [ "$(ls -A "$SCREENSHOT_DIR" 2>/dev/null)" ]; then
    ls -la "$SCREENSHOT_DIR"
else
    echo "  (empty - no screenshots yet)"
fi