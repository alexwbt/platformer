const Game = require('./game/index.js');
const Block = require('./game/object/block');
const Player = require('./game/object/player');

const game = new Game();

game.init();
game.spawnObject(new Player());
game.spawnBlock(new Block({ y: 15 }));

let startTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - startTime);
    startTime = now;
    game.update(deltaTime);
    game.render();
}, 1000 / 60);
