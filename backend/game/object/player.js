try {
    GameObject = require(".");
} catch (err) { }

class Player extends GameObject {

    constructor(initInfo) {
        super({
            character: 0,
            width: 7,
            height: 10,
            movedDistance: 0,
            controls: [],
            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.character = info.character;
        this.movedDistance = info.movedDistance;
        this.controls = info.controls;
    }

    update(deltaTime) {
        super.update();
        this.movedDistance += deltaTime;

        this.yVelocity += 0.1;
        if (this.controls[0] && this.onGround) this.yVelocity = -2;
    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        console.log(x, y, width, height);
        if (!onScreen) return;

        const originX = x + width / 2;
        const originY = y + height;

        this.game.ctx.save();
        this.game.ctx.translate(originX, originY);

        if (this.movedDistance > 0) {
            const angle = Math.cos(this.movedDistance * 2 * Math.PI);
            this.game.ctx.rotate(10 * angle * Math.PI / 180);
        }

        
        const yOffset = this.movedDistance > 0 ? Math.pow(Math.sin(this.movedDistance * 2 * Math.PI), 2) : 0;
        this.renderSprite(this.game.sprites[1], 0, 0, 16, 16, -height / 2, -height - yOffset * 10, height, height);
        this.game.ctx.restore();

        this.renderHitBox();
    }

}

try { module.exports = Player; }
catch (err) { }
