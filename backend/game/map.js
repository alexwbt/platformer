const PNG = require('png-js');
const { CLASS_BLOCK, CLASS_FIRE } = require('./classes');

const initMap = game => {
    PNG.decode(__dirname + '/resource/level1.png', pixels => {
        const mapSize = 512;
        const blockSize = 10;
        const bounds = { x1: mapSize, y1: mapSize, x2: 0, y2: 0 };
        for (let i = 0; i < pixels.length; i++) {
            for (let channel = 0; channel < 2; channel++) {
                const value = pixels[i * 4 + channel];
                if (value > 0) {
                    const ix = i % mapSize;
                    const iy = Math.floor(i / mapSize);
                    const x = ix * blockSize;
                    const y = iy * blockSize;
                    switch (channel) {
                        case 0:
                            switch (value) {
                                case 3:
                                    game.playerSpawnPoints.push({ x, y: y - blockSize });
                                    game.spawnParticle(CLASS_FIRE, { x, y: y - blockSize });
                                    break;
                                case 4:
                                    game.mobSpawnPoints.push({ x, y: y - blockSize });
                                    game.spawnParticle(CLASS_FIRE, { x, y: y - blockSize, fireType: 1 });
                                    break;
                                default:
                            }
                            game.spawnObject(CLASS_BLOCK, { x, y, blockType: value });
                            if (ix < bounds.x1) bounds.x1 = ix;
                            else if (ix > bounds.x2) bounds.x2 = ix;
                            if (iy < bounds.y1) bounds.y1 = iy;
                            else if (iy > bounds.y2) bounds.y2 = iy;
                            break;
                        case 1:
                            game.spawnDecorationBlock(CLASS_BLOCK, { x, y, blockType: value });
                        default:
                    }
                }
            }
        }
        game.mapData = [];
        for (let x = bounds.x1; x <= bounds.x2; x++) {
            const ix = x - bounds.x1;
            game.mapData[ix] = [];
            for (let y = bounds.y1; y <= bounds.y2; y++) {
                const iy = y - bounds.y1;
                const index = (y * mapSize + x) * 4;
                game.mapData[ix][iy] = pixels[index];
            }
        }
        game.bounds = bounds;
        game.deadline = bounds.y2 * blockSize + 500;
    });
};

module.exports = initMap;
