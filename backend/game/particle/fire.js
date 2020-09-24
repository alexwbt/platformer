try {
    Particle = require(".");
    SHAPE_RECT = require("../collision").SHAPE_RECT;
} catch (err) { }

class Fire extends Particle {

    constructor(game, initInfo) {
        super(game, {
            width: 10,
            height: 10,
            shape: SHAPE_RECT,

            ...initInfo
        });

        this.indices = [
            0, 1, 3, 2, 3
        ];
    }

    setInfo(info) {
        super.setInfo(info);
        this.width = info.width;
        this.height = info.height;
        this.shape = info.shape;
    }

    update(deltaTime) {
        this.passTime += deltaTime;
    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;

        const index = Math.floor((this.passTime * 12) % this.indices.length);
        const spriteSize = 8;
        const spriteX = this.indices[index] % 2 * spriteSize;
        const spriteY = Math.floor(this.indices[index] / 2) * spriteSize;

        super.renderSprite(this.game.sprites[0], 56 + spriteX, 24 + spriteY, 8, 8, x, y, width, height);
    }

}

try {
    module.exports = Fire;
} catch (err) { }
