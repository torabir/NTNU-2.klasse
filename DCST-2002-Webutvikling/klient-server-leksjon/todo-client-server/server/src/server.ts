/**
 * Web server entry point used in `npm start`.
 * This file sets up an Express server to serve a React application 
 * and enables live reload functionality using the `reload` package.
 */

import app from './app';
import express from 'express';
import path from 'path';
import http from 'http';
import reload from 'reload';
import fs from 'fs';

app.use(express.static(path.join(__dirname, '/../../client/public')));

// Create an HTTP server using the Express app (added)
const server = http.createServer(app);

// Initialize live reload functionality and set up file watching (added)
reload(app).then((reloader) => {
  // Refresh React application in browser when files in ../../client/public change (added)
  fs.watch(path.join(__dirname, '/../../client/public'), () => reloader.reload());

  const port = 3000;

  // Start the HTTP server and listen on the specified port (added `server.listen`)
  server.listen(port, () => {
    console.info(`Server running on port ${port}`);
  });
});
