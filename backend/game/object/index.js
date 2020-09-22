
class GameObject {

    constructor(initInfo) {
        this.setInfo({
            // game
            objectId: 0,
            objectType: 0,
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
    }

    setInfo(info) {
        // game
        this.objectId = info.objectId;
        this.objectType = info.objectType;
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

    }

    render() {

    }

    renderSprite(sprite, sx, sy, sWidth, sHeight) {
        const { x, y, width, height } = this.game.onScreen(this);
        this.game.ctx.fillStyle = 'red';
        this.game.ctx.imageSmoothingEnabled = false;
        this.game.ctx.drawImage(sprite, sx, sy, sWidth, sHeight, x, y, width, height);
    }

}

try {
    module.exports = GameObject;
} catch (err) { }
