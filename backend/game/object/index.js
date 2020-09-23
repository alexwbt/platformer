try {
    collision = require("../collision").collision;
    SHAPE_RECT = require("../collision").SHAPE_RECT;
    CLASS_OBJECT = require('../index').CLASS_OBJECT;
} catch (err) { }

class GameObject {

    constructor(game, initInfo) {
        this.game = game;
        this.setInfo({
            classType: CLASS_OBJECT,
            objectId: 0,
            shape: SHAPE_RECT,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            xVelocity: 0,
            yVelocity: 0,
            onGround: false,

            ...initInfo
        });
    }

    setInfo(info) {
        this.classType = info.classType;
        this.objectId = info.objectId;
        this.shape = info.shape;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.xVelocity = info.xVelocity;
        this.yVelocity = info.yVelocity;
        this.onGround = info.onGround;
    }

    setData(data) {
        let i = 0;
        this.classType = data[i++];
        this.objectId = data[i++];
        this.shape = data[i++];
        this.x = data[i++];
        this.y = data[i++];
        this.width = data[i++];
        this.height = data[i++];
        this.xVelocity = data[i++];
        this.yVelocity = data[i++];
        this.onGround = data[i++];
        return i;
    }

    getData() {
        return [
            this.classType,
            this.objectId,
            this.shape,
            this.x,
            this.y,
            this.width,
            this.height,
            this.xVelocity,
            this.yVelocity,
            this.onGround,
        ];
    }

    update() {
        if (Math.abs(this.xVelocity) >= 0.1) {
            this.x += this.xVelocity;
            for (const block of this.game.blocks) {
                if (collision(block, this)) {
                    if (this.xVelocity > 0) this.x = block.x - this.width;
                    else this.x = block.x + block.width;
                    this.xVelocity = 0;
                    break;
                }
            }
        }
        if (Math.abs(this.yVelocity) >= 0.1) {
            this.y += this.yVelocity;
            this.onGround = false;
            for (const block of this.game.blocks) {
                if (collision(block, this)) {
                    if (this.yVelocity > 0) {
                        this.y = block.y - this.height;
                        this.onGround = true;
                    } else this.y = block.y + block.height;
                    this.yVelocity = 0;
                    break;
                }
            }
        }
    }

    render() {

    }

    renderSprite(sprite, sx, sy, sWidth, sHeight, x, y, width, height) {
        this.game.ctx.imageSmoothingEnabled = false;
        this.game.ctx.drawImage(sprite, sx, sy, sWidth, sHeight, x, y, width, height);
    }

    renderHitBox() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;
        this.game.ctx.strokeStyle = 'red';
        this.game.ctx.strokeRect(x, y, width, height);
    }

}

try {
    module.exports = GameObject;
} catch (err) { }
