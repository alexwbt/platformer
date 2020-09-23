
const game = new Game();
window.game = game;

game.init();
const player = new Player();
game.spawnObject(player);
game.spawnBlock(new Block({ y: 15, width: 200 }));
game.spawnBlock(new Block({ y: 5, x: 20 }));

let startTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - startTime) / 1000;
    startTime = now;
    game.camera.x = player.x + player.width / 2;
    game.camera.y = player.y + player.height / 2;
    game.update(deltaTime);
    game.render();
}, 1000 / 60);

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'w': player.controls[0] = true; break;
        case 'a': player.controls[1] = true; break;
        case 's': player.controls[2] = true; break;
        case 'd': player.controls[3] = true; break;
        case ' ': player.controls[4] = true; break;
    }
});

window.addEventListener('keyup', e => {
    switch (e.key) {
        case 'w': player.controls[0] = false; break;
        case 'a': player.controls[1] = false; break;
        case 's': player.controls[2] = false; break;
        case 'd': player.controls[3] = false; break;
        case ' ': player.controls[4] = false; break;
    }
});

window.addEventListener('mousemove', e => {
    if (!game.canvas) return;
    const mouseInGame = game.inGame(e.x, e.y);
    player.aimDir = Math.atan2(mouseInGame.y - (player.y + player.height / 2), mouseInGame.x - (player.x + player.width / 2));
});

window.addEventListener('mousedown', e => {
    player.weapon.fire();
});

window.addEventListener('mousewheel', e => {
    game.scale -= e.deltaY / 100;
});
