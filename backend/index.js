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

const game = require('./game');
game.init();
const Block = require('./game/object/block');
game.spawnBlock(new Block());

http.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`);
});
