
const game = new Game();
window.game = game;

game.init();
const player = new Player();
game.spawnObject(player);
game.spawnBlock(new Block({ y: 15 }));

let startTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - startTime) / 1000;
    startTime = now;
    game.update(deltaTime);
    game.render();
}, 1000 / 60);

window.addEventListener('keydown', e => {
    switch (e.key) {
        case ' ': player.controls[0] = true;
    }
});

window.addEventListener('keyup', e => {
    switch (e.key) {
        case ' ': player.controls[0] = false;
    }
});
