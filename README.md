# Creator Code Image Generator

A web-based tool for creating customized text overlays on background images. Perfect for generating creator code images with customizable text, fonts, colors, and positioning.

## Features

- Multiple background image categories
  - Default (640x200)
  - Small Panels (320x240)
  - Long Panels (450x800)
- Text customization
  - Various Google Fonts support
  - Adjustable font size
  - Custom text color
  - Outline color and size
- Drag-and-drop text positioning
- Settings persistence between sessions
- Real-time preview

## Setup

1. Clone the repository
2. Ensure you have Node.js installed
3. Install dependencies: npm install express
4. Add any extra background images into the /public/images folders, each folder being a different size variant.
5. Start the server: node server.js
6. Access the application at `http://localhost:3000`

## Usage

1. Select an image category from the dropdown
2. Choose a background image
3. Enter your text
4. Customize the text appearance:
   - Select a font from the dropdown
   - Adjust font size
   - Choose text color
   - Set outline color and size
5. Drag the text to position it on the image
6. Settings are automatically saved

### System Fonts
- Arial
- Times New Roman
- Comic Sans MS
- Courier New
- Georgia
- Impact
- Trebuchet MS
- Verdana

### Google Fonts
- Pacifico
- Roboto
- Indie Flower
- Lobster
- Permanent Marker
- Bangers
- Shadows Into Light
- Montserrat
- Poppins
- Oswald
- Raleway
- Ubuntu
- Playfair Display
- Dancing Script
- Caveat
- Satisfy

## Technical Details

- Built with vanilla JavaScript
- Uses HTML5 Canvas for image manipulation
- Express.js backend for serving files
- LocalStorage for settings persistence
- FontFaceObserver for font loading management

## Browser Support

Tested and working in:
- Chrome
- Firefox
- Safari
- Edge