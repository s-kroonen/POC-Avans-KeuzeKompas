require('dotenv').config();
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, function () {
    // Callback, no promises
    console.log({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        pass: process.env.DB_PASSWORD ? 'set' : 'missing'
    });

    console.log('[server] listening on port', PORT);
});
