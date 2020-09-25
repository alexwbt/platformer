try {
    GameObject = require(".");
    Weapon = require('../weapon');
    collision = require("../collision").collision;
    SHAPE_LINE = require("../collision").SHAPE_LINE;
    CLASS_SPARKS = require("../classes").CLASS_SPARKS;
} catch (err) { }

class Character extends GameObject {

    constructor(game, initInfo) {
        super(game, {
            character: 3,
            name: '',
            width: 7,
            height: 10,
            movedTime: 0,
            lookingLeft: false,
            movingLeft: false,
            movingRight: false,
            controls: [],
            angle: 0,
            health: 1,
            jump: 0.2,
            jumpHold: 0,

            // weapon
            aimDir: 0,
            weaponType: Math.floor(Math.random() * 6),
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
        this.angle = info.angle;
        this.health = info.health;
        this.jump = info.jump;
        this.jumpHold = info.jumpHold;

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
        this.angle = data[i++];
        this.health = data[i++];
        this.jump = data[i++];
        this.jumpHold = data[i++];

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
            this.angle,
            this.health,
            this.jump,
            this.jumpHold,

            // weapon
            this.aimDir,
            this.weaponType,
            this.weapon.getData()
        ]);
    }

    hit(bullet, coll) {
        this.angle = 0.3 * bullet.xVelocity / Math.abs(bullet.xVelocity);
        this.health = Math.max(0, this.health - bullet.damage);
        for (const pt of coll)
            if (pt) this.game.spawnParticle(CLASS_SPARKS, { x: pt.x, y: pt.y, colorFunction: 2, amount: 30 });
    }

    update(deltaTime) {
        super.update();

        this.yVelocity += 0.3;

        // jump
        if (this.onGround)
            this.jumpHold = 0;

        // this.jumpHold = -1 when in air
        if (this.jumpHold >= 0 && (this.controls[0] || this.controls[4]))
            this.jumpHold += deltaTime;
        else if (!this.onGround) this.jumpHold = -1;

        if ((this.controls[0] || this.controls[4]) && this.jumpHold > 0 && this.jumpHold <= this.jump)
            // this.yVelocity = -4 * Math.sin((this.jumpHold / this.jump) * Math.PI / 2); // ease out sign
            this.yVelocity = -4 * (1 - Math.pow(1 - (this.jumpHold / this.jump), 3)); // ease out cubic

        // walk
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

        if (this.angle) {
            this.angle *= 0.9;
            if (Math.abs(this.angle) < 0.1) this.angle = 0;
        }

        if (this.health <= 0) {
            this.removed = true;
        }

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
        if (this.angle) {
            this.game.ctx.rotate(this.angle);
        } else if (this.movedTime > 0 && this.onGround) {
            const angle = Math.cos(this.movedTime * 2 * 2 * Math.PI) * (this.movingRight ? 1 : -1);
            this.game.ctx.rotate(5 * angle * Math.PI / 180);
            yOffset = Math.pow(Math.sin(this.movedTime * 2 * 2 * Math.PI), 2) / 2;
        }
        if (this.lookingLeft) this.game.ctx.scale(-1, 1);
        this.renderSprite(this.game.sprites[1], spriteX + 0.1, spriteY + 0.1, spriteSize - 0.1, spriteSize - 0.1, -height / 2, -height - yOffset * 10, height, height);
        this.game.ctx.restore();

        this.weapon.render();

        if (this.name) {
            this.game.ctx.font = `${4 * this.game.scale}px consolas`;
            this.game.ctx.fillStyle = "white";
            this.game.ctx.textAlign = "center";
            this.game.ctx.fillText(this.name, x + width / 2, y - 4.5 * this.game.scale);
        }

        this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.game.ctx.fillRect(x - 0.5 * this.game.scale, y - 3.5 * this.game.scale, width + this.game.scale, 2.5 * this.game.scale);
        this.game.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        this.game.ctx.fillRect(x, y - 3 * this.game.scale, width * this.health, 1.5 * this.game.scale);

        // this.renderHitBox();
    }

}

try { module.exports = Character; }
catch (err) { }
