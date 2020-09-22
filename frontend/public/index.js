
const game = new Game();
window.game = game;

game.init();
game.spawnBlock(new Block());

setInterval(() => {
    game.update();
    game.render();
}, 1000 / 60);
