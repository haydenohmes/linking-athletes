const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3845;
const ASSETS_DIR = path.join(__dirname, 'assets');

// Create assets directory if it doesn't exist
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  console.log(`Created assets directory at ${ASSETS_DIR}`);
  console.log('Please add your Figma assets to this directory.');
}

const server = http.createServer((req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse the URL
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const filePath = path.join(ASSETS_DIR, url.pathname.replace('/assets/', ''));

  // Security: prevent directory traversal
  const resolvedPath = path.resolve(filePath);
  const assetsDirResolved = path.resolve(ASSETS_DIR);
  
  if (!resolvedPath.startsWith(assetsDirResolved)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }

    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading file');
        return;
      }

      // Determine content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const contentTypes = {
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.json': 'application/json',
      };

      const contentType = contentTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Assets server running on http://localhost:${PORT}`);
  console.log(`Serving files from: ${ASSETS_DIR}`);
  console.log(`Example: http://localhost:${PORT}/assets/your-file.svg`);
});


