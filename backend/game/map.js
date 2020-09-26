const PNG = require('png-js');
const { CLASS_BLOCK, CLASS_FIRE } = require('./classes');

const initMap = game => {
    PNG.decode(__dirname + '/resource/map.png', pixels => {
        const blockSize = 10;
        let lowestY = 0;
        for (let i = 0; i < pixels.length; i++) {
            const value = pixels[i * 4];
            if (value > 0) {
                const x = (i % 512) * blockSize;
                const y = Math.floor(i / 512) * blockSize;
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
                if (y > lowestY) lowestY = y;
            }
        }
        game.deadline = lowestY + 500;
    });
};

module.exports = initMap;
