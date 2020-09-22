
const game = new Game();
window.game = game;

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
