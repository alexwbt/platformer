try {
    CLASS_BLOCK = require('./classes').CLASS_BLOCK;
    CLASS_FIRE = require('./classes').CLASS_FIRE;
} catch (err) { }

const initMap = game => {
    for (let i = -100; i <= 100; i++)
        game.spawnObject(CLASS_BLOCK, { x: i * 10, y: 45, blockType: 2 });

    for (let height = 0; height < 5; height++) {
        if (height % 2 === 0) {
            for (let i = -5; i <= 5; i++)
                game.spawnObject(CLASS_BLOCK, { x: 120 + i * 10, y: height * -45, blockType: 2 });
            for (let i = -5; i <= 5; i++)
                game.spawnObject(CLASS_BLOCK, { x: -120 + i * 10, y: height * -45, blockType: 2 });
        } else {
            for (let i = -5; i <= 5; i++)
                game.spawnObject(CLASS_BLOCK, { x: i * 10, y: height * - 45, blockType: 2 });
        }
    }

    game.spawnObject(CLASS_BLOCK, { y: 35, blockType: 1 });
    game.spawnParticle(CLASS_FIRE, { y: 25 });
};

try {
    module.exports = initMap;
} catch (err) { }
