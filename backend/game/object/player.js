try {
    GameObject = require(".");
    Weapon = require('../weapon');
} catch (err) { }

class Player extends GameObject {
    class = 'player';

    constructor(initInfo) {
        super({
            character: 0,
            width: 7,
            height: 10,
            movedTime: 0,
            lookingLeft: false,
            movingLeft: false,
            movingRight: false,
            controls: [],

            // weapon
            aimDir: 0,
            weaponType: 4,
            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.character = info.character;
        this.movedTime = info.movedTime;
        this.lookingLeft = info.lookingLeft;
        this.movingLeft = info.movingLeft;
        this.movingRight = info.movingRight;
        this.controls = info.controls;

        // weapon
        this.aimDir = info.aimDir;
        this.weaponType = info.weaponType;
        this.weapon = new Weapon();
        this.weapon.owner = this;
    }

    setData(data) {
        let i = super.setData(data);
        this.character = data[i++];
        this.movedTime = data[i++];
        this.lookingLeft = data[i++];
        this.movingLeft = data[i++];
        this.movingRight = data[i++];
        this.controls = data[i++];

        // weapon
        this.aimDir = data[i++];
        this.weaponType = data[i++];
        this.weapon = new Weapon();
        this.weapon.owner = this;
        return i;
    }

    getData() {
        return super.getData().concat([
            this.character,
            this.movedTime,
            this.lookingLeft,
            this.movingLeft,
            this.movingRight,
            this.controls,

            // weapon
            this.aimDir,
            this.weaponType,
        ]);
    }

    update(deltaTime) {
        super.update();

        this.yVelocity += 0.1;

        if ((this.controls[0] || this.controls[4]) && this.onGround) this.yVelocity = -2;

        if (this.controls[1]) {
            this.xVelocity = -1;
            this.lookingLeft = true;
            this.movingLeft = true;
        } else if (this.movingLeft) {
            this.movingLeft = false;
            this.xVelocity = 0;
        }
        if (this.controls[3]) {
            this.xVelocity = 1;
            this.lookingLeft = false;
            this.movingRight = true;
        } else if (this.movingRight) {
            this.movingRight = false;
            this.xVelocity = 0;
        }

        if (this.movingLeft || this.movingRight)
            this.movedTime += deltaTime;
        else this.movedTime = 0;

        this.weapon.update();
    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;

        const originX = x + width / 2;
        const originY = y + height;

        this.game.ctx.save();
        this.game.ctx.translate(originX, originY);

        let yOffset = 0;
        if (this.movedTime > 0 && this.onGround) {
            const angle = Math.cos(this.movedTime * 2 * 2 * Math.PI) * (this.movingRight ? 1 : -1);
            this.game.ctx.rotate(5 * angle * Math.PI / 180);
            yOffset = Math.pow(Math.sin(this.movedTime * 2 * 2 * Math.PI), 2) / 2;
        }
        if (this.lookingLeft) this.game.ctx.scale(-1, 1);
        this.renderSprite(this.game.sprites[1], 64, 16, 16, 16, -height / 2, -height - yOffset * 10, height, height);
        this.game.ctx.restore();

        // this.renderHitBox();

        this.weapon.render();
    }

}

try { module.exports = Player; }
catch (err) { }
