try {
    Character = require("./character");
    Weapon = require('../weapon');

    CLASS_CHARACTER = require("../classes").CLASS_CHARACTER;
    CLASS_COIN = require("../classes").CLASS_COIN;
    SHAPE_RECT = require("../collision").SHAPE_RECT;
    collision = require("../collision").collision;
} catch (err) { }

class Mob extends Character {

    constructor(game, initInfo) {
        super(game, {
            character: 14,
            weaponType: -1,
            targetRange: 150,
            noTargetCounter: 0,
            ...initInfo,
        });

        this.controls[Math.random() < 0.5 ? 1 : 3] = true;
        this.controls[0] = true;
    }

    setInfo(info) {
        super.setInfo(info);
        this.targetRange = info.targetRange;
        this.noTargetCounter = info.noTargetCounter;
    }

    setData(data) {
        let i = super.setData(data);
        this.targetRange = data[i++];
        this.noTargetCounter = data[i++];
        return i;
    }

    getData() {
        return super.getData().concat([
            this.targetRange,
            this.noTargetCounter,
        ]);
    }

    hit(bullet, coll) {
        if (this.health <= 0) return;
        this.angle = 0.3 * bullet.xVelocity / Math.abs(bullet.xVelocity);
        this.health = Math.max(0, this.health - bullet.damage * (1.5 + Math.random() * 0.5));
        if (this.health === 0) {
            const coins = Math.ceil(Math.random() * 4);
            for (let i = 0; i < coins; i++) {
                this.game.spawnObject(CLASS_COIN, {
                    x: this.x,
                    y: this.y,
                    xVelocity: (Math.random() - 0.5) * 2,
                    yVelocity: Math.random() - 0.5
                });
            }
        }
        for (const pt of coll)
            if (pt) this.game.spawnParticle(CLASS_SPARKS, { x: pt.x, y: pt.y, colorFunction: 2, amount: 30 });
    }

    update(deltaTime) {
        let target = false;
        let targetDis = false;
        for (const obj of this.game.objects) {
            if (obj.classType === CLASS_CHARACTER && obj.health > 0) {
                const dis = Math.pow(this.x - obj.x, 2) + Math.pow(this.y - obj.y, 2);
                if (dis < this.targetRange * this.targetRange) {
                    if (!target || (target && targetDis > dis)) {
                        targetDis = dis;
                        target = obj;
                    }
                    if (collision(this, obj)) {
                        obj.hit();
                        obj.health -= deltaTime / 2;
                        if (this.game.saveEvents && obj.health <= 0)
                            this.game.events.push({ diedObj: obj });
                    }
                }
            }
        }

        if (target) {
            this.noTargetCounter = 0;
            // const blockSize = 10;
            const targetCenter = target.getCenter();
            // const targetX = Math.floor(targetCenter.x / blockSize) * blockSize;
            // const targetY = Math.floor(targetCenter.y / blockSize) * blockSize;
            const center = this.getCenter();
            this.controls[1] = center.x > targetCenter.x;
            this.controls[3] = center.x < targetCenter.x;
            this.controls[0] = center.y > targetCenter.y;
        }
        super.update(deltaTime);
        if (target) this.controls[4] = (this.controls[1] || this.controls[3]) && !this.xMovement;
        else {
            this.noTargetCounter += deltaTime;
            if (this.noTargetCounter >= 10) this.removed = true;
        }
    }

}

try { module.exports = Mob; }
catch (err) { }
