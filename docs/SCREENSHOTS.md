# Screenshots Guide 📸

This document provides instructions for taking and updating screenshots for the Links2Go project.

## Required Screenshots

### 1. Main Interface - URL Shortener (`main-interface.png`)
**What to capture:**
- Full CRT monitor interface with URL shortening form
- ASCII logo visible at the top
- Terminal-style input fields
- Status indicators (online/offline)
- Navigation tabs [SHORTEN] and [ANALYTICS]

**Steps:**
1. Start the application: `nix develop` then `dev`
2. Navigate to http://localhost:5173
3. Ensure the [SHORTEN] tab is active
4. Take a full-screen screenshot
5. Crop to show the complete CRT monitor interface

### 2. Analytics Dashboard (`analytics-dashboard.png`)
**What to capture:**
- Analytics interface with sample data
- Device breakdown charts
- Clicks by hour visualization  
- Recent activity table
- Terminal-style command prompts

**Steps:**
1. First create a short URL and click it several times
2. Go to the [ANALYTICS] tab
3. Enter the short code to view analytics
4. Take screenshot showing the complete analytics dashboard

### 3. QR Code Generation (`qr-code-modal.png`)
**What to capture:**
- QR code modal dialog
- Generated QR code
- URL information display
- Action buttons (Download, Copy QR, Copy URL)
- Retro-styled modal design

**Steps:**
1. Create a shortened URL
2. Click the QR code icon on a shortened URL
3. Wait for QR code to generate
4. Take screenshot of the modal

### 4. Retro Terminal Experience (`terminal-experience.png`)
**What to capture:**
- Focus on the retro aesthetic elements
- Scanlines effect visible
- Phosphor green glow
- ASCII art logo
- Terminal-style text
- CRT monitor bezel and frame

**Steps:**
1. Take a screenshot emphasizing the retro visual effects
2. Ensure scanlines and glow effects are visible
3. Capture the overall nostalgic computing experience

## Screenshot Specifications

- **Format:** PNG
- **Quality:** High resolution (at least 1920x1080)
- **Browser:** Use Chrome/Firefox for consistent rendering
- **Zoom:** 100% browser zoom level
- **Theme:** Dark theme if your OS supports it

## File Naming Convention

- Use lowercase with hyphens: `main-interface.png`
- Be descriptive but concise
- Match the filenames referenced in README.md

## Tools Recommended

### macOS
- **Cmd + Shift + 4** - Screenshot selection
- **Cmd + Shift + 5** - Screenshot with options
- **CleanShot X** - Professional screenshot tool

### Windows
- **Win + Shift + S** - Snipping tool
- **PrtScn** - Full screen capture
- **Greenshot** - Free screenshot tool

### Linux
- **gnome-screenshot** - GNOME screenshot tool
- **scrot** - Command line tool
- **flameshot** - Feature-rich screenshot tool

## Editing Guidelines

1. **Crop appropriately** - Remove unnecessary browser chrome
2. **Maintain aspect ratio** - Keep the CRT monitor proportions
3. **Optimize file size** - Use PNG compression while maintaining quality
4. **Consistent styling** - All screenshots should have similar lighting/contrast

## Adding New Screenshots

1. Place screenshots in `docs/screenshots/`
2. Update README.md with new image references
3. Add descriptions in this file
4. Commit changes with descriptive messages

## Example Commands

```bash
# After taking screenshots, optimize them:
# macOS with ImageOptim
imageoptim docs/screenshots/*.png

# Linux with optipng
optipng docs/screenshots/*.png

# Add to git
git add docs/screenshots/
git commit -m "docs: add application screenshots"
```

## Quality Checklist

- [ ] All required screenshots are present
- [ ] Images are high resolution and clear
- [ ] Retro CRT effects are visible
- [ ] No sensitive information is shown
- [ ] File sizes are reasonable (<2MB each)
- [ ] Alt text is descriptive in README.md

## Updating Screenshots

When the UI changes significantly:

1. Retake affected screenshots
2. Update this guide if new screenshot types are needed
3. Maintain consistency with existing screenshot style
4. Test that all images load correctly in README.md

---

**Note:** Screenshots should showcase the unique retro aesthetic of Links2Go and demonstrate the key functionality to potential users and contributors.