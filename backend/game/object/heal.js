try {
    GameObject = require(".");
    CLASS_CHARACTER = require("../classes").CLASS_CHARACTER;
    collision = require("../collision").collision;
} catch (err) { }

class Heal extends GameObject {

    constructor(game, initInfo) {
        super(game, {
            width: 5,
            height: 5,

            despawnTime: 60,
            amount: 1,

            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.amount = info.amount;
    }

    setData(data) {
        let i = super.setData(data);
        this.amount = data[i++];
        return i;
    }

    getData() {
        return super.getData().concat([
            this.amount,
        ]);
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.yVelocity += 0.1;
        for (const obj of this.game.objects) {
            if (obj.classType === CLASS_CHARACTER) {
                if (collision(obj, this)) {
                    this.removed = true;
                    obj.heals += this.amount;
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
        this.game.ctx.drawImage(this.game.sprites[5], 0, 0, 11, 11, x, y, width, height);
    }

}

try {
    module.exports = Heal;
} catch (err) { }
