try {
    collision = require("../collision").collision;
    SHAPE_RECT = require("../collision").SHAPE_RECT;
} catch (err) { }

class GameObject {

    constructor(initInfo) {
        this.setInfo({
            // game
            objectId: 0,
            objectType: 0,
            shape: SHAPE_RECT,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            xVelocity: 0,
            yVelocity: 0,

            // render
            alpha: 1,

            ...initInfo
        });

        this.onGround = false;
    }

    setInfo(info) {
        // game
        this.objectId = info.objectId;
        this.objectType = info.objectType;
        this.shape = info.shape;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.xVelocity = info.xVelocity;
        this.yVelocity = info.yVelocity;

        // render
        this.alpha = info.alpha;
    }

    update() {
        if (this.xVelocity > 0) {
            this.x += this.xVelocity;
            for (const block of this.game.blocks) {
                if (collision(block, this)) {
                    if (this.xVelocity > 0) {
                        this.x = block.x - this.width;
                        this.onGround = true;
                    } else this.x = block.x + block.width;
                    this.xVelocity = 0;
                    break;
                }
            }
        }
        if (this.yVelocity > 0) {
            this.y += this.yVelocity;
            for (const block of this.game.blocks) {
                if (collision(block, this)) {
                    if (this.yVelocity > 0) this.y = block.y - this.height;
                    else this.y = block.y + block.height;
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
