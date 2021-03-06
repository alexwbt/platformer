try {
    GameObject = require(".");
    SHAPE_LINE = require('../collision').SHAPE_LINE;
    collision = require('../collision').collision;
    Sparks = require("../particle/sparks");
    CLASS_SPARKS = require('../classes').CLASS_SPARKS;
    CLASS_CHARACTER = require("../classes").CLASS_CHARACTER;
    CLASS_MOB = require("../classes").CLASS_MOB;
} catch (err) { }

class Bullet extends GameObject {

    constructor(game, initInfo) {
        super(game, {
            width: 1,
            height: 1,
            ownerId: 0,

            dir: 0,
            speed: 10,
            travelTime: 0.2,
            traveledTime: 0,
            damage: 0.4,

            shape: SHAPE_LINE,

            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.ownerId = info.ownerId;
        this.dir = info.dir;
        this.speed = info.speed;
        this.travelTime = info.travelTime;
        this.traveledTime = info.traveledTime;
        this.damage = info.damage;

        this.xVelocity = Math.cos(this.dir) * this.speed;
        this.yVelocity = Math.sin(this.dir) * this.speed;
    }

    setData(data) {
        let i = super.setData(data);
        this.ownerId = data[i++];
        this.dir = data[i++];
        this.speed = data[i++];
        this.travelTime = data[i++];
        this.traveledTime = data[i++];
        this.damage = data[i++];

        this.xVelocity = Math.cos(this.dir) * this.speed;
        this.yVelocity = Math.sin(this.dir) * this.speed;
        return i;
    }

    getData() {
        return super.getData().concat([
            this.ownerId,
            this.dir,
            this.speed,
            this.travelTime,
            this.traveledTime,
            this.damage,
        ]);
    }

    update(deltaTime) {
        this.traveledTime += deltaTime;
        if (this.traveledTime >= this.travelTime) {
            this.removed = true;
            return;
        }
        this.x1 = this.x;
        this.y1 = this.y;
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.x2 = this.x;
        this.y2 = this.y;
        for (const block of this.game.blocks) {
            const coll = collision(block, this)
            if (coll) {
                for (const pt of coll)
                    if (pt) this.game.spawnParticle(CLASS_SPARKS, { x: pt.x, y: pt.y });
                this.removed = true;
                break;;
            }
        }

        for (const obj of this.game.objects) {
            if (obj.classType === CLASS_CHARACTER || obj.classType === CLASS_MOB) {
                const coll = collision(obj, this);
                if (coll) {
                    obj.hit(this, coll);
                    this.removed = true;
                    break;
                }
            }
        }
    }

    render() {
        const one = this.game.onScreen({ x: this.x1, y: this.y1 });
        const two = this.game.onScreen({ x: this.x2, y: this.y2 });
        const size = 0.8 * this.game.scale;
        this.game.ctx.strokeStyle = 'rgba(150, 150, 150, 0.4)';
        this.game.ctx.lineWidth = size;
        this.game.ctx.beginPath();
        this.game.ctx.moveTo(one.x, one.y);
        this.game.ctx.lineTo(one.x + (two.x - one.x) * 0.99, one.y + (two.y - one.y) * 0.99);
        this.game.ctx.stroke();
    }

}

try {
    module.exports = Bullet;
} catch (err) { }
