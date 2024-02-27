const express = require('express');

const app = express();
const port = 3000;

// Use express as middleware, serve files from public directory
app.use(express.static('public'));

// Set up express to listen to POST requests and process commands accordingly


// Set app up to listen
app.listen(port, () => {
    console.log('Robot controller listening at http://localhost:' + port);
});