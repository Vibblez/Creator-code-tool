const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to get list of background images
app.get('/api/backgrounds', (req, res) => {
    const categories = {
        default: {
            path: 'public/images/default',
            dimensions: '640x200'
        },
        small_panels: {
            path: 'public/images/small_panels',
            dimensions: '320x240'
        },
        long_panels: {
            path: 'public/images/long_panels',
            dimensions: '450x800'
        }
    };

    try {
        console.log('Processing /api/backgrounds request');
        const result = {};
        
        for (const [category, info] of Object.entries(categories)) {
            console.log(`Checking category: ${category}, path: ${info.path}`);
            
            // Check if directory exists
            if (!fs.existsSync(info.path)) {
                console.warn(`Directory does not exist: ${info.path}`);
                continue;
            }
            
            const files = fs.readdirSync(info.path);
            console.log(`Found files in ${category}:`, files);
            
            const imageFiles = files.filter(file => 
                /\.(jpg|jpeg|png|gif)$/i.test(file)
            );
            console.log(`Filtered image files in ${category}:`, imageFiles);
            
            result[category] = {
                images: imageFiles,
                dimensions: info.dimensions
            };
        }
        
        console.log('Sending response:', result);
        res.json(result);
    } catch (err) {
        console.error('Error in /api/backgrounds:', err);
        res.status(500).json({ error: 'Unable to scan directories', details: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    // Log the current working directory
    console.log('Current working directory:', process.cwd());
});