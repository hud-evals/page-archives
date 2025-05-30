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
app.get('/:archiveName', (req, res, next) => {
    const potentialArchivePath = path.join(archivesDir, req.params.archiveName + '.wacz');
    const potentialArchiveNameOnly = req.params.archiveName;

    // Check if it might be a request for a static file in the root (e.g., favicon.ico, manifest.json)
    // You might want to expand this list or use a more robust static file serving for the root if needed.
    if (potentialArchiveNameOnly.includes('.')) { // Simple check for file extension
        const rootFilePath = path.join(__dirname, potentialArchiveNameOnly);
        if (fs.existsSync(rootFilePath)) {
            return res.sendFile(rootFilePath);
        }
    }

    // Heuristic: If it doesn't have an extension and a WACZ file with that name exists, serve index.html
    // Or, if it's a known archive from a list (if we were to read archive_list.json server-side)
    // For now, we'll rely on the WACZ file existing for simplicity.
    if (fs.existsSync(potentialArchivePath)) {
        res.sendFile(path.join(__dirname, 'index.html'));
    } else {
        // If it's not an existing WACZ and not explicitly handled, pass to 404 handler
        next();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 