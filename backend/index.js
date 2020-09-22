require('dotenv').config();
const { PORT } = process.env;
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const client = require('./client');
io.on('connection', client.connection);

app.use(require('cors')());
app.use(express.static('game'));

require('./game.js');

http.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});
