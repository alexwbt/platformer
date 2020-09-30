try {
    Particle = require(".");
    SHAPE_RECT = require("../collision").SHAPE_RECT;
} catch (err) { }

class Fire extends Particle {

    constructor(game, initInfo) {
        super(game, {
            fireType: 0,
            width: 10,
            height: 10,
            shape: SHAPE_RECT,

            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.fireType = info.fireType;
        this.width = info.width;
        this.height = info.height;
        this.shape = info.shape;
    }

    setData(data) {
        let i = super.setData(data);
        this.fireType = data[i++];
        return i;
    }

    getData() {
        return super.getData().concat([
            this.fireType
        ]);
    }

    update(deltaTime) {
        this.passTime += deltaTime;
    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;
        const index = Math.floor((this.passTime * 12) % 4);
        const spriteX = (index + 4.1) * 8;
        const spriteY = (this.fireType * 8) + 0.1;
        this.game.ctx.drawImage(this.game.sprites[0], spriteX, spriteY, 7.8, 7.8, x, y, width, height);
    }

}

try {
    module.exports = Fire;
} catch (err) { }
