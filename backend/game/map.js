const PNG = require('png-js');
const { CLASS_BLOCK } = require('./classes');

const initMap = game => {
    PNG.decode(__dirname + '/resource/map.png', pixels => {
        for (let i = 0; i < pixels.length; i++) {
            if (pixels[i * 4] > 0) {
                const x = (i % 512) * 10;
                const y = Math.floor(i / 512) * 10;
                game.spawnObject(CLASS_BLOCK, { x, y, blockType: 2 });
            }
        }
    });
};

module.exports = initMap;
