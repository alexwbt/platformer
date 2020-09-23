
const game = new Game();
window.game = game;


game.spawnObject(CLASS_BLOCK, { y: 15, width: 200 });

let player = false;
player = game.spawnObject(CLASS_PLAYER);

const socket = io(SERVER);

socket.on('connect', () => {
    console.log('socket connected');
});

socket.on('game-data', data => {
    // game.setData(data);
});

let startTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - startTime) / 1000;
    startTime = now;
    if (player) {
        game.camera.x = player.x + player.width / 2;
        game.camera.y = player.y + player.height / 2;
    }
    game.update(deltaTime);
    game.render();
}, 1000 / 60);

window.addEventListener('keydown', e => {
    if (player) {
        switch (e.key.toLowerCase()) {
            case 'w': player.controls[0] = true; break;
            case 'a': player.controls[1] = true; break;
            case 's': player.controls[2] = true; break;
            case 'd': player.controls[3] = true; break;
            case ' ': player.controls[4] = true; break;
        }
        socket.emit('player-control', player.controls);
    }
});

window.addEventListener('keyup', e => {
    if (player) {
        switch (e.key.toLowerCase()) {
            case 'w': player.controls[0] = false; break;
            case 'a': player.controls[1] = false; break;
            case 's': player.controls[2] = false; break;
            case 'd': player.controls[3] = false; break;
            case ' ': player.controls[4] = false; break;
        }
        socket.emit('player-control', player.controls);
    }
});

window.addEventListener('mousemove', e => {
    if (!game.canvas || !player) return;
    const mouseInGame = game.inGame(e.x, e.y);
    player.aimDir = Math.atan2(mouseInGame.y - (player.y + player.height / 2), mouseInGame.x - (player.x + player.width / 2));
    socket.emit('player-aim', player.aimDir);
});

window.addEventListener('mousedown', e => {
    if (player && e.button === 0) player.weapon.firing = true;
});

window.addEventListener('mouseup', e => {
    if (player && e.button === 0) player.weapon.firing = false;
});

window.addEventListener('mousewheel', e => {
    game.scale = Math.max(1, game.scale - e.deltaY / 100);
});
