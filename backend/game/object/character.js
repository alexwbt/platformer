try {
    GameObject = require(".");
    Weapon = require('../weapon');
} catch (err) { }

class Character extends GameObject {

    constructor(game, initInfo) {
        super(game, {
            character: 6,
            name: '',
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
        this.name = info.name;
        this.movedTime = info.movedTime;
        this.lookingLeft = info.lookingLeft;
        this.movingLeft = info.movingLeft;
        this.movingRight = info.movingRight;
        this.controls = info.controls;

        // weapon
        this.aimDir = info.aimDir;
        this.weaponType = info.weaponType;
        this.weapon = new Weapon(this);
    }

    setData(data) {
        let i = super.setData(data);
        this.character = data[i++];
        this.name = data[i++];
        this.movedTime = data[i++];
        this.lookingLeft = data[i++];
        this.movingLeft = data[i++];
        this.movingRight = data[i++];
        this.controls = data[i++];

        // weapon
        this.aimDir = data[i++];
        this.weaponType = data[i++];
        this.weapon = new Weapon(this);
        this.weapon.setData(data[i++]);
        return i;
    }

    getData() {
        return super.getData().concat([
            this.character,
            this.name,
            this.movedTime,
            this.lookingLeft,
            this.movingLeft,
            this.movingRight,
            this.controls,

            // weapon
            this.aimDir,
            this.weaponType,
            this.weapon.getData()
        ]);
    }

    hit(bullet) {
        
    }

    update(deltaTime) {
        super.update();

        this.yVelocity += 0.1;

        if ((this.controls[0] || this.controls[4]) && this.onGround) this.yMovement = -3.2;

        if (this.controls[1]) {
            this.xMovement = -1;
            this.lookingLeft = true;
            this.movingLeft = true;
        } else if (this.movingLeft) {
            this.movingLeft = false;
            this.xMovement = 0;
        }
        if (this.controls[3]) {
            this.xMovement = 1;
            this.lookingLeft = false;
            this.movingRight = true;
        } else if (this.movingRight) {
            this.movingRight = false;
            this.xMovement = 0;
        }

        if (this.movingLeft || this.movingRight)
            this.movedTime += deltaTime;
        else this.movedTime = 0;

        this.weapon.update(deltaTime);
    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;

        const originX = x + width / 2;
        const originY = y + height;

        const spriteSize = 16;
        const spriteX = (this.character % 8) * spriteSize;
        const spriteY = Math.floor(this.character / 8) * spriteSize

        this.game.ctx.save();
        this.game.ctx.translate(originX, originY);

        let yOffset = 0;
        if (this.movedTime > 0 && this.onGround) {
            const angle = Math.cos(this.movedTime * 2 * 2 * Math.PI) * (this.movingRight ? 1 : -1);
            this.game.ctx.rotate(5 * angle * Math.PI / 180);
            yOffset = Math.pow(Math.sin(this.movedTime * 2 * 2 * Math.PI), 2) / 2;
        }
        if (this.lookingLeft) this.game.ctx.scale(-1, 1);
        this.renderSprite(this.game.sprites[1], spriteX + 0.1, spriteY + 0.1, spriteSize - 0.1, spriteSize - 0.1, -height / 2, -height - yOffset * 10, height, height);
        this.game.ctx.restore();

        if (this.name) {
            this.game.ctx.font = `${4 * this.game.scale}px consolas`;
            this.game.ctx.fillStyle = "white";
            this.game.ctx.textAlign = "center";
            this.game.ctx.fillText(this.name, x + width / 2, y - 2 * this.game.scale);
        }

        // this.renderHitBox();

        this.weapon.render();
    }

}

try { module.exports = Character; }
catch (err) { }
