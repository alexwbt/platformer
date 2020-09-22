try {
    GameObject = require(".");
} catch (err) { }

class Player extends GameObject {

    constructor(initInfo) {
        super({
            character: 0,
            width: 7,
            height: 10,
            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.character = info.character;

        this.movedDistance = 0;
    }

    update(deltaTime) {
        super.update();
        this.movedDistance += deltaTime / 1000;

        this.yVelocity += 0.1;
    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;

        const originX = x + width / 2;
        const originY = y + height;

        this.game.ctx.save();
        this.game.ctx.translate(originX, originY);

        const angle = Math.cos(this.movedDistance * 2 * Math.PI);
        this.game.ctx.rotate(10 * angle * Math.PI / 180);

        const yOffset = Math.pow(Math.sin(this.movedDistance * 2 * Math.PI), 2);
        this.renderSprite(this.game.sprites[1], 0, 0, 16, 16, -height / 2, -height - yOffset * 10, height, height);
        this.game.ctx.restore();

        this.renderHitBox();
    }

}

try { module.exports = Player; }
catch (err) { }
