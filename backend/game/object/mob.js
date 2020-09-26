try {
    Character = require("./character");
    Weapon = require('../weapon');
} catch (err) { }

class Mob extends Character {

    constructor(game, initInfo) {
        super(game, {
            character: 14,
            weaponType: -1,
            ...initInfo,
        });

        this.controls[0] = true;
        this.controls[1] = true;
    }

    hit(bullet, coll) {
        this.angle = 0.3 * bullet.xVelocity / Math.abs(bullet.xVelocity);
        this.health = Math.max(0, this.health - bullet.damage * 1.5);
        for (const pt of coll)
            if (pt) this.game.spawnParticle(CLASS_SPARKS, { x: pt.x, y: pt.y, colorFunction: 2, amount: 30 });
    }

}

try { module.exports = Mob; }
catch (err) { }
