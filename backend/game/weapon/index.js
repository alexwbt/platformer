try {
    CLASS_BULLET = require('../classes.js').CLASS_BULLET;
    CLASS_SPARKS = require('../classes.js').CLASS_SPARKS;
} catch (err) { }

const weaponInfo = [
    {
        name: 'Pistol',
        gripX: 12,
        gripY: 9,
        fireX: 17,
        fireY: 6,
        auto: false,
        fireGap: 0.1,
        scale: 0.5,
        damage: 0.3,
        accuracy: 0.2,
        speed: 8,
        travelTime: 0.2,
        magSize: 12,
        reloadTime: 1,
        projectile: 1,
        carry: 120,
        price: 0,
        ammoPrice: 10,
    },
    {
        name: 'Submachine Gun',
        gripX: 13,
        gripY: 9,
        fireX: 28,
        fireY: 7,
        auto: true,
        fireGap: 0.1,
        scale: 0.5,
        damage: 0.3,
        accuracy: 0.2,
        speed: 8,
        travelTime: 0.25,
        magSize: 21,
        reloadTime: 1,
        projectile: 1,
        carry: 210,
        price: 30,
        ammoPrice: 20,
    },
    {
        name: 'Machine Gun',
        gripX: 13,
        gripY: 9,
        fireX: 35,
        fireY: 7,
        auto: true,
        fireGap: 0.15,
        scale: 0.5,
        damage: 0.4,
        accuracy: 0.15,
        speed: 9,
        travelTime: 0.27,
        magSize: 100,
        reloadTime: 6,
        projectile: 1,
        carry: 200,
        price: 80,
        ammoPrice: 50,
    },
    {
        name: 'Double Barrow Shotgun',
        gripX: 13,
        gripY: 9,
        fireX: 28,
        fireY: 7,
        auto: false,
        fireGap: 0.1,
        scale: 0.5,
        damage: 0.3,
        accuracy: 0.05,
        speed: 8,
        travelTime: 0.25,
        magSize: 2,
        reloadTime: 1,
        projectile: 5,
        carry: 50,
        price: 80,
        ammoPrice: 20,
    },
    {
        name: 'DMR',
        gripX: 13,
        gripY: 9,
        fireX: 36,
        fireY: 5,
        auto: false,
        fireGap: 0.25,
        scale: 0.5,
        damage: 0.5,
        accuracy: 0.5,
        speed: 14,
        travelTime: 0.3,
        magSize: 20,
        reloadTime: 2,
        projectile: 1,
        carry: 100,
        price: 90,
        ammoPrice: 25,
    },
    {
        name: 'Sniper Rifle',
        gripX: 13,
        gripY: 9,
        fireX: 40,
        fireY: 1,
        auto: false,
        fireGap: 0.5,
        scale: 0.5,
        damage: 0.9,
        accuracy: 1,
        speed: 16,
        travelTime: 0.35,
        magSize: 11,
        reloadTime: 3,
        projectile: 1,
        carry: 99,
        price: 100,
        ammoPrice: 30,
    },
];

class Weapon {

    constructor(owner, initInfo) {
        this.owner = owner;
        this.setInfo({
            x: 0,
            y: 0,
            magOffset: 0,
            firing: false,
            firingTimer: 0,
            released: false,
            ammo: weaponInfo[this.owner.weaponType].magSize,
            carryingAmmo: weaponInfo[this.owner.weaponType].carry,
            reloadTimer: 0,
            ...initInfo
        });
    }

    setInfo(info) {
        this.x = info.x;
        this.y = info.y;
        this.magOffset = info.magOffset;
        this.firing = info.firing;
        this.firingTimer = info.firingTimer;
        this.released = info.released;
        this.ammo = info.ammo;
        this.reloadTimer = info.reloadTimer;
        this.carryingAmmo = info.carryingAmmo;
    }

    setData(data) {
        let i = 0;
        this.x = data[i++];
        this.y = data[i++];
        this.magOffset = data[i++];
        this.firing = data[i++];
        this.firingTimer = data[i++];
        this.released = data[i++];
        this.ammo = data[i++];
        this.reloadTimer = data[i++];
        this.carryingAmmo = data[i++];
        return i;
    }

    getData() {
        return [
            this.x,
            this.y,
            this.magOffset,
            this.firing,
            this.firingTimer,
            this.released,
            this.ammo,
            this.reloadTimer,
            this.carryingAmmo,
        ];
    }

    buy(weapon) {
        const info = weaponInfo[weapon];
        if (info && this.owner.weaponType !== weapon && this.owner.coins >= info.price) {
            this.owner.coins -= info.price;
            this.owner.weaponType = weapon;
            this.ammo = info.magSize;
            this.carryingAmmo = info.carry;
        }
    }

    buyAmmo(weapon) {
        const info = weaponInfo[weapon];
        if (info && this.owner.weaponType === weapon && this.owner.coins >= info.ammoPrice) {
            this.owner.coins -= info.ammoPrice;
            this.carryingAmmo += info.carry;
        }
    }

    fire() {
        if (this.ammo <= 0) return;
        this.ammo--;
        const info = weaponInfo[this.owner.weaponType];
        const flip = Math.abs(this.owner.aimDir) > Math.PI / 2;
        const dir = Math.atan2(info.fireY * info.scale * (flip ? -1 : 1), -info.fireX * info.scale) + this.owner.aimDir;
        const mag = Math.sqrt(Math.pow(info.fireY * info.scale, 2) + Math.pow(info.fireX * info.scale, 2)) / 2;

        const x = this.x - Math.cos(dir) * mag;
        const y = this.y - Math.sin(dir) * mag;
        for (let i = 0; i < info.projectile; i++) {
            const randDir = Math.PI / (100 * info.accuracy);
            const bulletDir = this.owner.aimDir + Math.random() * randDir - randDir / 2;
            this.owner.game.spawnObject(CLASS_BULLET, { x, y, dir: bulletDir, ...info });
            this.owner.game.spawnParticle(CLASS_SPARKS, { x, y, dir: this.owner.aimDir, randomRange: Math.PI / 4, radius: 10, colorFunction: 1 });
        }

        this.magOffset = 0.3;
    }

    reload() {
        if (this.reloadTimer > 0 || this.carryingAmmo <= 0 || this.ammo === weaponInfo[this.owner.weaponType].magSize) return;
        this.reloadTimer = weaponInfo[this.owner.weaponType].reloadTime;
    }

    update(deltaTime) {
        const info = weaponInfo[this.owner.weaponType];
        this.x = this.owner.x + this.owner.width / 2 + Math.cos(this.owner.aimDir) * this.owner.width * 0.7 * (1 - this.magOffset);
        this.y = this.owner.y + this.owner.height / 2 + Math.sin(this.owner.aimDir) * this.owner.width * 0.7 * (1 - this.magOffset);
        if (this.magOffset > 0) this.magOffset -= 0.1;
        else if (this.magOffset < 0) this.magOffset = 0;

        this.firingTimer -= deltaTime;
        if (this.firing && this.reloadTimer <= 0) {
            if (this.firingTimer <= 0 && this.ammo > 0 && (info.auto || this.released)) {
                this.fire();
                this.firingTimer = info.fireGap;
            }
            this.released = false;
        } else this.released = true;

        if (this.reloadTimer > 0) {
            this.reloadTimer -= deltaTime;
            if (this.reloadTimer <= 0) {
                this.reloadTimer = 0;
                this.carryingAmmo -= info.magSize - this.ammo;
                this.ammo = info.magSize;
                if (this.carryingAmmo < 0) {
                    this.ammo += this.carryingAmmo;
                    this.carryingAmmo = 0;
                }
            }
        }
    }

    render() {
        const info = weaponInfo[this.owner.weaponType];
        const spriteWidth = 33;
        const spriteHeight = 17;
        const spriteX = (this.owner.weaponType % 4) * spriteWidth;
        const spriteY = Math.floor(this.owner.weaponType / 4) * spriteHeight + 0.5;
        const flip = Math.abs(this.owner.aimDir) > Math.PI / 2;
        const { x, y, width, height } = this.owner.game.onScreen({
            x: this.x, y: this.y,
            width: spriteWidth * info.scale,
            height: spriteHeight * info.scale
        });
        this.owner.game.ctx.save();
        this.owner.game.ctx.translate(x, y);
        this.owner.game.ctx.rotate(this.owner.aimDir + this.reloadTimer * Math.PI * 2 / info.reloadTime);
        if (flip)
            this.owner.game.ctx.scale(1, -1);
        this.owner.game.ctx.drawImage(this.owner.game.sprites[2],
            spriteX, spriteY, spriteWidth, spriteHeight,
            -info.gripX * this.owner.game.scale * info.scale,
            -info.gripY * this.owner.game.scale * info.scale, width, height);
        this.owner.game.ctx.restore();

        if (this.owner.game.renderWeaponPoints) {
            this.owner.game.ctx.fillStyle = 'red';
            this.owner.game.ctx.fillRect(x, y, 2, 2);

            const dir = Math.atan2(info.fireY * info.scale * (flip ? -1 : 1), -info.fireX * info.scale) + this.owner.aimDir;
            const mag = Math.sqrt(Math.pow(info.fireY * info.scale, 2) + Math.pow(info.fireX * info.scale, 2)) / 2;
            const firePoint = this.owner.game.onScreen({
                x: this.x + - Math.cos(dir) * mag,
                y: this.y + - Math.sin(dir) * mag
            });
            this.owner.game.ctx.fillStyle = 'yellow';
            this.owner.game.ctx.fillRect(firePoint.x, firePoint.y, 2, 2);
        }
    }

    renderInfo() {
        const spriteWidth = 33;
        const spriteHeight = 17;
        const spriteX = (this.owner.weaponType % 4) * spriteWidth;
        const spriteY = Math.floor(this.owner.weaponType / 4) * spriteHeight + 0.5;
        const displayScale = 5;
        this.owner.game.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.owner.game.ctx.fillRect(20, this.owner.game.canvas.height - spriteHeight * displayScale - 20,
            spriteWidth * displayScale * Math.min(1, 1 - this.firingTimer / weaponInfo[this.owner.weaponType].fireGap), spriteHeight * displayScale);
        this.owner.game.ctx.lineWidth = 5;
        this.owner.game.ctx.strokeStyle = 'black';
        this.owner.game.ctx.strokeRect(20, this.owner.game.canvas.height - spriteHeight * displayScale - 20,
            spriteWidth * displayScale, spriteHeight * displayScale);
        this.owner.game.ctx.drawImage(this.owner.game.sprites[2],
            spriteX, spriteY, spriteWidth, spriteHeight,
            20, this.owner.game.canvas.height - spriteHeight * displayScale - 20,
            spriteWidth * displayScale, spriteHeight * displayScale);

        this.owner.game.ctx.font = "30px consolas";
        this.owner.game.ctx.fillStyle = "white";
        this.owner.game.ctx.textAlign = "left";
        this.owner.game.ctx.fillText(`${(this.ammo + '').padStart(3, '0')}`, 50, this.owner.game.canvas.height - spriteHeight * displayScale - 30);

        this.owner.game.ctx.font = "20px consolas";
        this.owner.game.ctx.fillText(`/${(this.carryingAmmo + '').padStart(3, '0')}`, 100, this.owner.game.canvas.height - spriteHeight * displayScale - 30);

        this.owner.game.ctx.drawImage(this.owner.game.sprites[3], 0, 0, 32, 32, 25, this.owner.game.canvas.height - spriteHeight * displayScale - 50, 20, 20);
    }

}

try {
    module.exports = Weapon;
} catch (err) { }
