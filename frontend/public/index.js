
const game = new Game();
window.game = game;

let player = false;
let playerId = 0;
// player = game.spawnObject(CLASS_CHARACTER);
// game.spawnObject(CLASS_BLOCK, { y: 55, x: 100, width: 200 });
// game.spawnObject(CLASS_BLOCK, { y: 100, width: 400 });
// game.spawnObject(CLASS_BLOCK, { y: 0, height: 101 });
// game.cameraFocusId = player.objectId;

const socket = io(SERVER);

socket.on('connect', () => {
    console.log('socket connected');

    socket.emit('player-name', 'alex');
});

socket.on('player-id', id => {
    playerId = id;
    game.cameraFocusId = id;
});

socket.on('game-data', data => {
    game.setData(data);
    if (!player && playerId) {
        player = game.objects.find(o => o.objectId === playerId);
    }
});

let startTime = Date.now();
setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - startTime) / 1000;
    startTime = now;
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
    player.aimDir = Math.atan2(e.y - (game.canvas.height / 2), e.x - (game.canvas.width / 2));
    socket.emit('player-aim', player.aimDir);
});

window.addEventListener('mousedown', e => {
    if (player && e.button === 0) {
        player.weapon.firing = true;
        socket.emit('player-fire', true);
    }
});

window.addEventListener('mouseup', e => {
    if (player && e.button === 0) {
        player.weapon.firing = false;
        socket.emit('player-fire', false);
    }
});

// window.addEventListener('mousewheel', e => {
//     game.scale = Math.max(1, game.scale - e.deltaY / 100);
// });
