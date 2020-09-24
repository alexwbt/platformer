try {
    CLASS_BULLET = require('../classes.js').CLASS_BULLET;
    CLASS_SPARKS = require('../classes.js').CLASS_SPARKS;
} catch (err) { }

const weaponInfo = [
    {},
    {},
    {},
    {},
    {
        gripX: 13 / 2,
        gripY: 9 / 2,
        fireX: 20 / 2,
        fireY: 6 / 2
    }
];

class Weapon {

    constructor(owner, initInfo) {
        this.owner = owner;
        this.setInfo({
            x: 0,
            y: 0,
            width: 33 / 2,
            height: 17 / 2,
            magOffset: 0,
            firing: false,
            fireGap: 0.5,
            firingTimer: 0,
            ...initInfo
        });
    }

    setInfo(info) {
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.magOffset = info.magOffset;
        this.firing = info.firing;
        this.fireGap = info.fireGap;
        this.firingTimer = info.firingTimer;
    }

    setData(data) {
        let i = 0;
        this.x = data[i++];
        this.y = data[i++];
        this.width = data[i++];
        this.height = data[i++];
        this.magOffset = data[i++];
        this.firing = data[i++];
        this.fireGap = data[i++];
        this.firingTimer = data[i++];
        return i;
    }

    getData() {
        return [
            this.x,
            this.y,
            this.width,
            this.height,
            this.magOffset,
            this.firing,
            this.fireGap,
            this.firingTimer,
        ];
    }

    fire() {
        const flip = Math.abs(this.owner.aimDir) > Math.PI / 2;
        const dir = Math.atan2(weaponInfo[this.owner.weaponType].fireY * (flip ? -1 : 1), -weaponInfo[this.owner.weaponType].fireX) + this.owner.aimDir;
        const mag = Math.sqrt(Math.pow(weaponInfo[this.owner.weaponType].fireY, 2) + Math.pow(weaponInfo[this.owner.weaponType].fireX, 2)) / 2;

        const x = this.x + this.owner.x + this.owner.width / 2 - Math.cos(dir) * mag;
        const y = this.y + this.owner.y + this.owner.height / 2 - Math.sin(dir) * mag;
        const randDir = Math.PI / 20;
        const bulletDir = this.owner.aimDir + Math.random() * randDir - randDir / 2;
        this.owner.game.spawnObject(CLASS_BULLET, { x, y, dir: bulletDir, speed: 8 });
        this.owner.game.spawnParticle(CLASS_SPARKS, { x, y, dir: this.owner.aimDir, randomRange: Math.PI / 4, radius: 10, red: true });

        this.magOffset = 0.3;
    }

    update(deltaTime) {
        this.x = Math.cos(this.owner.aimDir) * this.owner.width * 0.7 * (1 - this.magOffset);
        this.y = Math.sin(this.owner.aimDir) * this.owner.width * 0.7 * (1 - this.magOffset);
        if (this.magOffset > 0) this.magOffset -= 0.1;
        else if (this.magOffset < 0) this.magOffset = 0;

        if (this.firing) {
            this.firingTimer -= deltaTime;
            if (this.firingTimer <= 0) {
                this.fire();
                this.firingTimer = this.fireGap;
            }
        } else this.firingTimer = 0;
    }

    render() {
        const { x, y, width, height } = this.owner.game.onScreen({
            x: this.x + this.owner.x + this.owner.width / 2,
            y: this.y + this.owner.y + this.owner.height / 2,
            width: this.width,
            height: this.height
        });
        const flip = Math.abs(this.owner.aimDir) > Math.PI / 2;
        const spriteWidth = 33;
        const spriteHeight = 17;
        const spriteX = (this.owner.weaponType % 4) * spriteWidth;
        const spriteY = Math.floor(this.owner.weaponType / 4) * spriteHeight + 0.5;
        this.owner.game.ctx.save();
        this.owner.game.ctx.translate(x, y);
        this.owner.game.ctx.rotate(this.owner.aimDir);
        if (flip)
            this.owner.game.ctx.scale(1, -1);
        this.owner.game.ctx.drawImage(this.owner.game.sprites[2],
            spriteX, spriteY, spriteWidth, spriteHeight,
            -weaponInfo[this.owner.weaponType].gripX * this.owner.game.scale,
            -weaponInfo[this.owner.weaponType].gripY * this.owner.game.scale, width, height);
        this.owner.game.ctx.restore();


        // this.owner.game.ctx.fillStyle = 'red';
        // this.owner.game.ctx.fillRect(x, y, 2, 2);

        // const dir = Math.atan2(weaponInfo[this.owner.weaponType].fireY * (flip ? -1 : 1), -weaponInfo[this.owner.weaponType].fireX) + this.owner.aimDir;
        // const mag = Math.sqrt(Math.pow(weaponInfo[this.owner.weaponType].fireY, 2) + Math.pow(weaponInfo[this.owner.weaponType].fireX, 2)) / 2;
        // const firePoint = this.owner.game.onScreen({
        //     x: this.x + this.owner.x + this.owner.width / 2 - Math.cos(dir) * mag,
        //     y: this.y + this.owner.y + this.owner.height / 2 - Math.sin(dir) * mag
        // });
        // this.owner.game.ctx.fillStyle = 'yellow';
        // this.owner.game.ctx.fillRect(firePoint.x, firePoint.y, 2, 2);
    }

}

try {
    module.exports = Weapon;
} catch (err) { }
