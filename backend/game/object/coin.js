try {
    GameObject = require(".");
    CLASS_CHARACTER = require("../classes").CLASS_CHARACTER;
    collision = require("../collision").collision;
} catch (err) { }

class Coin extends GameObject {

    constructor(game, initInfo) {
        super(game, {
            width: 2,
            height: 2,

            despawnTime: 60,

            ...initInfo
        });
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.yVelocity += 0.1;
        for (const obj of this.game.objects) {
            if (obj.classType === CLASS_CHARACTER) {
                if (collision(obj, this)) {
                    this.removed = true;
                    obj.coins++;
                } else {
                    const objCenter = obj.getCenter();
                    const center = this.getCenter();
                    const xDiff = objCenter.x - center.x;
                    const yDiff = objCenter.y - center.y;
                    const dis = xDiff * xDiff + yDiff * yDiff;
                    if (dis < 225) {
                        this.xVelocity = 2 * xDiff / Math.abs(xDiff);
                        this.yVelocity = 2 * yDiff / Math.abs(yDiff);
                    } else {
                        this.xVelocity *= 0.8;
                    }
                }
            }
        }
        this.yVelocity += 0.1;
    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;
        this.game.ctx.fillStyle = 'gold';
        this.game.ctx.beginPath();
        this.game.ctx.arc(x + width / 2, y + height / 2, width / 2, 0, 2 * Math.PI);
        this.game.ctx.fill();
        this.game.ctx.strokeStyle = 'orange';
        this.game.ctx.lineWidth = 0.5 * this.game.scale;
        this.game.ctx.stroke();
        // this.game.ctx.fillStyle = 'orange';
        // this.game.ctx.fillRect(this.x + this.width / 4, this.y + this.height / 4, this.width / 2, this.height / 2);
    }

}

try {
    module.exports = Coin;
} catch (err) { }
