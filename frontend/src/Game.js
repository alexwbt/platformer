import io from 'socket.io-client';

const initGame = () => {
    const game = new window.Game();
    // window.weaponInfo = weaponInfo;
    window.stopListening = true;

    let player = false;
    let playerId = 0;

    const socket = io(process.env.REACT_APP_GAME_SERVER);

    socket.on('connect', () => {
        console.log('socket connected');
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
        if (player && !window.stopListening) {
            switch (e.key.toLowerCase()) {
                case 'w': player.controls[0] = true; break;
                case 'a': player.controls[1] = true; break;
                case 's': player.controls[2] = true; break;
                case 'd': player.controls[3] = true; break;
                case ' ': player.controls[4] = true; break;
                case 'h': player.controls[5] = true; break;
                case 'r': socket.emit('player-reload'); break;
                case 'f1': e.preventDefault(); game.renderGrid = !game.renderGrid; break;
                case 'f2': e.preventDefault(); game.renderWeaponPoints = !game.renderWeaponPoints; break;
                case 'f3': e.preventDefault(); game.renderHitBox = !game.renderHitBox; break;
                default:
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
                case 'h': player.controls[5] = false; break;
                default:
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
        if (player && !window.stopListening) {
            switch (e.button) {
                case 0:
                    player.weapon.firing = true;
                    socket.emit('player-fire', true);
                    break;
                case 2:
                    socket.emit('player-reload');
                    break;
                default:
            }
        }
    });

    window.addEventListener('mouseup', e => {
        if (player && e.button === 0) {
            player.weapon.firing = false;
            socket.emit('player-fire', false);
        }
    });

    window.addEventListener('contextmenu', e => {
        e.preventDefault();
        return false;
    });

    window.addEventListener('mousewheel', e => {
        if (!window.stopListening)
            game.scale = Math.max(1, game.scale - e.deltaY / 100);
    });

    window.onblur = () => {
        if (player) {
            player.weapon.firing = false;
            player.controls[0] = false;
            player.controls[1] = false;
            player.controls[2] = false;
            player.controls[3] = false;
            player.controls[4] = false;
            socket.emit('player-control', player.controls);
            socket.emit('player-fire', false);
        }
    };

    return [game, socket];
};

export default initGame;
