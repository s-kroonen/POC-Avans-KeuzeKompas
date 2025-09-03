require('dotenv').config();
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, function () {
    // Callback, no promises
    console.log('[server] listening on port', PORT);
});
