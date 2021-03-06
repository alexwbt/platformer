try {
    GameObject = require(".");
    Weapon = require('../weapon');
    collision = require("../collision").collision;
    SHAPE_LINE = require("../collision").SHAPE_LINE;
    CLASS_CHARACTER = require("../classes").CLASS_CHARACTER;
    CLASS_SPARKS = require("../classes").CLASS_SPARKS;
    CLASS_COIN = require("../classes").CLASS_COIN;
    CLASS_HEAL = require("../classes").CLASS_HEAL;
} catch (err) { }

class Character extends GameObject {

    constructor(game, initInfo) {
        super(game, {
            character: 0,
            name: '',
            width: 7,
            height: 10,
            movedTime: 0,
            lookingLeft: false,
            movingLeft: false,
            movingRight: false,
            movementSpeed: 1,
            controls: [],
            angle: 0,
            health: 1,
            jump: 0.2,
            jumpHold: 0,
            coins: 0,
            heals: 0,
            healTimer: 0,
            healTime: 1,

            // game
            hasBomb: false,

            // weapon
            aimDir: 0,
            weaponType: 0,
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
        this.movementSpeed = info.movementSpeed;
        this.controls = info.controls;
        this.angle = info.angle;
        this.health = info.health;
        this.jump = info.jump;
        this.jumpHold = info.jumpHold;
        this.coins = info.coins;
        this.heals = info.heals;
        this.healTimer = info.healTimer;
        this.healTime = info.healTime;

        // game
        this.hasBomb = info.hasBomb;

        // weapon
        this.aimDir = info.aimDir;
        this.weaponType = info.weaponType;
        if (this.weaponType >= 0)
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
        this.movementSpeed = data[i++];
        this.controls = data[i++];
        this.angle = data[i++];
        this.health = data[i++];
        this.jump = data[i++];
        this.jumpHold = data[i++];
        this.coins = data[i++];
        this.heals = data[i++];
        this.healTimer = data[i++];
        this.healTime = data[i++];

        // game
        this.hasBomb = data[i++];

        // weapon
        this.aimDir = data[i++];
        this.weaponType = data[i++];
        if (this.weaponType >= 0) {
            this.weapon = new Weapon(this);
            this.weapon.setData(data[i]);
        }
        i++;
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
            this.movementSpeed,
            this.controls,
            this.angle,
            this.health,
            this.jump,
            this.jumpHold,
            this.coins,
            this.heals,
            this.healTimer,
            this.healTime,

            // game
            this.hasBomb,

            // weapon
            this.aimDir,
            this.weaponType,
            this.weaponType >= 0 && this.weapon.getData()
        ]);
    }

    hit(bullet, coll) {
        if (this.health <= 0) return;
        if (bullet) {
            this.angle = 0.3 * bullet.xVelocity / Math.abs(bullet.xVelocity);
            this.health = Math.max(0, this.health - bullet.damage);
            if (this.game.saveEvents && this.health <= 0)
                this.game.events.push({ diedObj: this, bullet });
            for (const pt of coll)
                if (pt) this.game.spawnParticle(CLASS_SPARKS, { x: pt.x, y: pt.y, colorFunction: 2, amount: 30 });
        } else this.game.spawnParticle(CLASS_SPARKS, { ...this.getCenter(), colorFunction: 2, amount: 30 });
    }

    buyHeal() {
        if (this.coins > 10) {
            this.coins -= 10;
            this.heals++;
        }
    }

    dropItems() {
        const items = [
            { amount: this.coins, classType: CLASS_COIN },
            { amount: this.heals, classType: CLASS_HEAL },
        ];

        for (const item of items) {
            let divide = 1;
            for (let i = 100; true; i *= 10)
                if (item.amount >= i) divide *= 10;
                else break;
            for (let i = 0; i < Math.floor(item.amount / divide); i++) {
                this.game.spawnObject(item.classType, {
                    x: this.x,
                    y: this.y,
                    xVelocity: (Math.random() - 0.5) * 2,
                    yVelocity: Math.random() - 0.5,
                    amount: divide
                });
            }
            const left = item.amount % divide;
            if (left >= 1) {
                this.game.spawnObject(item.classType, {
                    x: this.x,
                    y: this.y,
                    xVelocity: (Math.random() - 0.5) * 2,
                    yVelocity: Math.random() - 0.5,
                    amount: left
                });
            }
        }
    }

    update(deltaTime) {
        // jump
        if (this.onGround)
            this.jumpHold = 0;

        // this.jumpHold = -1 when in air
        if (this.jumpHold >= 0 && (this.controls[0] || this.controls[4]))
            this.jumpHold += deltaTime;
        else if (!this.onGround) this.jumpHold = -1;

        if ((this.controls[0] || this.controls[4]) && !this.controls[5] && this.jumpHold > 0 && this.jumpHold <= this.jump)
            this.yVelocity = -4 * (1 - Math.pow(1 - (this.jumpHold / this.jump), 3)); // ease out cubic

        // walk
        if (this.controls[1] && !this.controls[5]) {
            this.xMovement = -this.movementSpeed;
            this.lookingLeft = true;
            this.movingLeft = true;
        } else if (this.movingLeft) {
            this.movingLeft = false;
            this.xMovement = 0;
        }
        if (this.controls[3] && !this.controls[5]) {
            this.xMovement = this.movementSpeed;
            this.lookingLeft = false;
            this.movingRight = true;
        } else if (this.movingRight) {
            this.movingRight = false;
            this.xMovement = 0;
        }

        // heal
        if (this.controls[5] && this.heals >= 1 && this.health < 1) {
            this.healTimer += deltaTime;
            if (this.healTimer >= this.healTime) {
                this.heals--;
                this.health = Math.min(1, this.health + 0.35);
                this.healTimer = 0;
            }
        } else this.healTimer = 0;

        if (this.movingLeft || this.movingRight)
            this.movedTime += deltaTime;
        else this.movedTime = 0;

        if (this.angle) {
            this.angle *= 0.9;
            if (Math.abs(this.angle) < 0.1) this.angle = 0;
        }

        if (this.health <= 0) {
            this.removed = true;
            this.dropItems();
        }

        super.update();
        this.yVelocity += 0.3;

        
        if (this.game.saveEvents && this.classType === CLASS_CHARACTER && this.game.deadline && this.y > this.game.deadline) {
            this.game.events.push({ diedObj: this, fell: true });
        }

        if (this.hasBomb) {
            this.game.spawnParticle(CLASS_SPARKS, {
                x: this.x + this.width - 1,
                y: this.y - this.height * 2,
                radius: 5,
                colorFunction: 1
            });
        }

        if (this.explode) {
            this.game.spawnParticle(CLASS_SPARKS, {
                x: this.x + this.width / 2,
                y: this.y - this.height,
                radius: 30,
                amount: 300,
                colorFunction: 1
            });
        }

        if (this.weaponType >= 0)
            this.weapon.update(deltaTime);
    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;

        const originX = x + width / 2;
        const originY = y + height;

        const spriteSize = 16;
        const spriteX = (this.character % 8) * spriteSize + 0.1;
        const spriteY = Math.floor(this.character / 8) * spriteSize + 0.1

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
        this.game.ctx.drawImage(this.game.sprites[1], spriteX, spriteY, spriteSize - 0.2, spriteSize - 0.2, -height / 2, -height - yOffset * 10, height, height);
        this.game.ctx.restore();

        if (this.weaponType >= 0)
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

        if (this.healTimer > 0) {
            this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.game.ctx.beginPath();
            this.game.ctx.arc(this.game.canvas.width / 2, this.game.canvas.height / 2, 50, 0, Math.PI * 2);
            this.game.ctx.fill();
            this.game.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            this.game.ctx.beginPath();
            this.game.ctx.moveTo(this.game.canvas.width / 2, this.game.canvas.height / 2);
            this.game.ctx.arc(this.game.canvas.width / 2, this.game.canvas.height / 2, 45, 0, Math.PI * 2 * this.healTimer / this.healTime);
            this.game.ctx.fill();
        }

        if (this.hasBomb) {
            const bombWidth = 10 * this.game.scale;
            const bombHeight = 12.5 * this.game.scale
            this.game.ctx.drawImage(this.game.sprites[6], 0, 0, 15, 19, x + (width - bombWidth) / 2, y - height * 2, bombWidth, bombHeight);
        }

        if (this.game.renderHitBox)
            this.renderHitBox();
    }

    renderInfo() {
        this.game.ctx.font = '30px consolas';
        this.game.ctx.fillStyle = "white";
        this.game.ctx.textAlign = "left";

        this.game.ctx.drawImage(this.game.sprites[4], 0, 0, 16, 16, 20, 20, 32, 32);
        this.game.ctx.fillText(this.coins, 65, 45);

        this.game.ctx.drawImage(this.game.sprites[5], 0, 0, 11, 11, 20, 60, 32, 32);
        this.game.ctx.fillText(this.heals, 65, 85);
    }

}

try { module.exports = Character; }
catch (err) { }
