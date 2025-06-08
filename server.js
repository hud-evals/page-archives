const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000; // Or any port you prefer

const archivesDir = path.join(__dirname, 'archives');

// Serve static files from node_modules, archives, and the replay directory
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/archives', express.static(archivesDir));
app.use('/replay', express.static(path.join(__dirname, 'replay')));

// Serve index.html for the root path and specific known files at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle requests that could be archive names
const handleArchiveRequest = (req, res, next) => {
    const archiveName = req.params.archiveName;

    // Exclude known static directories from being treated as archives.
    // The express.static middleware runs first, but this is a safeguard for root requests.
    if (['node_modules', 'archives', 'replay'].includes(archiveName)) {
        return next();
    }

    // If the request is for a file with an extension, it's likely a static asset.
    // Let's check if it exists in the root directory (e.g., favicon.ico).
    if (archiveName.includes('.')) {
        const rootFilePath = path.join(__dirname, archiveName);
        if (fs.existsSync(rootFilePath)) {
            return res.sendFile(rootFilePath);
        }
        // If a file with an extension is not found, it's a 404.
        return next();
    }

    // For any other path, assume it's an archive request and serve the main app.
    // The client-side logic in index.html will handle fetching from the API or local fallback.
    return res.sendFile(path.join(__dirname, 'index.html'));
};

app.get('/:archiveName', handleArchiveRequest);
app.get('/page-archives/:archiveName', handleArchiveRequest);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 