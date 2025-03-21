let backgroundData = {};
let currentCategory = 'default';
let isInitializing = true;
let selectedAsset = null;
let isResizing = false;
let resizeHandle = '';

const categoryDefaults = {
    default: {
        textX: 100,
        textY: 175
    },
    small_panels: {
        textX: 80,
        textY: 225
    },
    long_panels: {
        textX: 100,
        textY: 750
    }
};

async function loadBackgrounds() {
    try {
        const response = await fetch('/api/backgrounds');
        backgroundData = await response.json();
        
        // Populate category select
        const categorySelect = document.getElementById('categorySelect');
        categorySelect.innerHTML = Object.entries(backgroundData).map(([category, data]) => {
            let label;
            switch(category) {
                case 'default':
                    label = 'Default (640x200)';
                    break;
                case 'small_panels':
                    label = 'Small Panels (320x240)';
                    break;
                case 'long_panels':
                    label = 'Long Panels (450x800)';
                    break;
                default:
                    label = 'default';
            }
            return `<option value="${category}">${label}</option>`;
        }).join('');
        
        updateBackgroundSelect(currentCategory, true);
    } catch (error) {
        console.error('Error loading backgrounds:', error);
    }
}

function updateBackgroundSelect(category, skipSave = false) {
    const bgSelect = document.getElementById('bgSelect');
    const categoryData = backgroundData[category];
    
    if (categoryData) {
        bgSelect.innerHTML = categoryData.images.map(bg =>
            `<option value="/images/${category}/${bg}">${bg}</option>`
        ).join('');
        
        // Update canvas dimensions
        const [width, height] = categoryData.dimensions.split('x').map(Number);
        canvas.width = width;
        canvas.height = height;
        
        // Always reset text position when changing categories
        textX = categoryDefaults[category].textX;
        textY = categoryDefaults[category].textY;
        
        // Always load the first image of the new category
        image.src = `/images/${category}/${categoryData.images[0]}`;
        
        // Only save if not skipped (during initialization)
        if (!skipSave) {
            saveSettings();
        }
    }
}

// Regular category change should still save
document.getElementById('categorySelect').addEventListener('change', function() {
    currentCategory = this.value;
    updateBackgroundSelect(currentCategory, false);  // Don't skip save on user change
    saveSettings();
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const image = new Image();

document.getElementById('bgSelect').addEventListener('change', function() {
    if (isInitializing) return;
    const selected = this.value;
    image.src = selected;
    saveSettings();
});

let text = "creator code";
let textColor = "#ffffff";
let outlineColor = "#000000";
let fontSize = 30;
let outlineSize = 1;
let fontFace = "Arial";
let textX = 100;
let textY = 175;
let isDragging = false;
let offsetX, offsetY;

image.onload = function () {
    draw();
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw text
    ctx.font = `${fontSize}px '${fontFace}'`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineSize;
    ctx.fillText(text, textX, textY);
    ctx.strokeText(text, textX, textY);
}

// Function to save settings to localStorage
function saveSettings() {
    const settings = {
        text: text,
        textColor: textColor,
        outlineColor: outlineColor,
        fontSize: fontSize,
        outlineSize: outlineSize,
        fontFace: fontFace,
        textX: textX,
        textY: textY,
        category: currentCategory
    };
    localStorage.setItem('creatorCodeSettings', JSON.stringify(settings));
}

// Function to load settings from localStorage
async function loadSettings() {
    const savedSettings = localStorage.getItem('creatorCodeSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Update variables
        text = settings.text || "creator code";
        textColor = settings.textColor || "#ffffff";
        outlineColor = settings.outlineColor || "#000000";
        fontSize = settings.fontSize || 30;
        outlineSize = settings.outlineSize || 2;
        fontFace = settings.fontFace || "Arial";
        textX = settings.textX || categoryDefaults[currentCategory].textX;
        textY = settings.textY || categoryDefaults[currentCategory].textY;
        currentCategory = settings.category || "default";
        
        // Load font if it's not a system font
        const systemFonts = ['Arial', 'Times New Roman', 'Comic Sans MS', 'Courier New', 
                           'Georgia', 'Impact', 'Trebuchet MS', 'Verdana'];
        if (!systemFonts.includes(fontFace)) {
            await loadFont(fontFace);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Update UI elements without triggering save
        document.getElementById('textInput').value = text;
        document.getElementById('colorInput').value = textColor;
        document.getElementById('outlineColorInput').value = outlineColor;
        document.getElementById('fontSizeInput').value = fontSize;
        document.getElementById('outlineSizeInput').value = outlineSize;
        document.getElementById('fontSelect').value = fontFace;
        document.getElementById('categorySelect').value = currentCategory;
    }
}

// Modify updateCanvas to save settings after each change
function updateCanvas() {
    text = document.getElementById('textInput').value || " ";
    textColor = document.getElementById('colorInput').value;
    outlineColor = document.getElementById('outlineColorInput').value;
    fontSize = parseInt(document.getElementById('fontSizeInput').value);
    outlineSize = parseInt(document.getElementById('outlineSizeInput').value);
    fontFace = document.getElementById('fontSelect').value;
    draw();
    saveSettings();
}

// Auto-update on input changes
document.getElementById('textInput').addEventListener('input', updateCanvas);
document.getElementById('colorInput').addEventListener('input', updateCanvas);
document.getElementById('outlineColorInput').addEventListener('input', updateCanvas);
document.getElementById('fontSizeInput').addEventListener('input', updateCanvas);
document.getElementById('outlineSizeInput').addEventListener('input', updateCanvas);
document.getElementById('fontSelect').addEventListener('change', updateCanvas);

canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check text
    ctx.font = `${fontSize}px '${fontFace}'`;
    const textWidth = ctx.measureText(text).width;
    const textHeight = fontSize;

    if (
        mouseX >= textX &&
        mouseX <= textX + textWidth &&
        mouseY >= textY - textHeight &&
        mouseY <= textY
    ) {
        isDragging = true;
        offsetX = mouseX - textX;
        offsetY = mouseY - textY;
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        textX = mouseX - offsetX;
        textY = mouseY - offsetY;
        draw();
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
    saveSettings();
});

canvas.addEventListener('mouseleave', function() {
    isDragging = false;
});

function changeBackground(src) {
    image.src = src;
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'marbles_custom_image.png';
    link.href = canvas.toDataURL();
    link.click();
}

async function copyImageToClipboard() {
    try {
        // Convert canvas to blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve));

        // Create ClipboardItem
        const data = new ClipboardItem({
            'image/png': blob
        });

        // Copy to clipboard
        await navigator.clipboard.write([data]);
        alert('Image copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy image:', err);
        alert('Failed to copy image to clipboard. Your browser might not support this feature.');
    }
}

// Replace or add to the downloadImage function
function downloadImage() {
    const link = document.createElement('a');
    link.download = 'marbles_custom_image.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Theme handling
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    return savedTheme;
}

function updateThemeButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

// Update init to be async and wait for loadSettings
async function init() {    
    isInitializing = true;
    await loadBackgrounds();
    initTheme();
    await loadSettings();
    updateBackgroundSelect(currentCategory, true);
    draw();
    isInitializing = false;
}

// Add this function to load fonts
async function loadFont(fontFamily) {
    try {
        const font = new FontFaceObserver(fontFamily);
        await font.load('Creator Code', { timeout: 10000 });
        
        // Just wait a bit and try again - the font might be loaded by Google Fonts already
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if the font is available now
        if (document.fonts.check(`12px "${fontFamily}"`)) {
            return true;
        }
        
        // Continue anyway - the Google Fonts stylesheet should handle it
        return true;
    } catch (error) {
        return false;
    }
}

// Clean up font select event listener
document.getElementById('fontSelect').addEventListener('change', async function() {
    const selectedFont = this.value;
    
    // Don't wait for system fonts
    const systemFonts = ['Arial', 'Times New Roman', 'Comic Sans MS', 'Courier New', 
                        'Georgia', 'Impact', 'Trebuchet MS', 'Verdana'];
    
    if (!systemFonts.includes(selectedFont)) {
        await loadFont(selectedFont);
        // Add a small delay to ensure font is ready
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    fontFace = selectedFont;
    draw();
    saveSettings();
});

// Start initialization
init();