try {
    Particle = require(".");
} catch (err) { }

const sparksColorFunctions = [
    () => `rgba(255, ${Math.random() * 55 + 200}, 0, ${Math.random() * 0.7})`,
    () => `rgba(255, ${Math.random() * 255}, 0, ${Math.random() * 0.7})`,
    () => `rgba(150, 0, 0, 1)`,
];

class Sparks extends Particle {

    constructor(game, initInfo) {
        super(game, {
            duration: 0.1,
            dir: 0,
            randomRange: Math.PI * 2,
            radius: 5,
            colorFunction: 0,
            amount: 10,
            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.dir = info.dir;
        this.randomRange = info.randomRange;
        this.radius = info.radius;
        this.colorFunction = info.colorFunction;
        this.amount = info.amount;

        this.sparks = [];
        for (let i = 0; i < this.amount; i++) {
            const dir = this.dir + Math.random() * this.randomRange - this.randomRange / 2;
            const radius = Math.random() * this.radius;
            this.sparks.push({ dir, radius });
        }
    }

    setData(data) {
        let i = super.setData(data);
        this.dir = data[i++];
        this.randomRange = data[i++];
        this.radius = data[i++];
        this.colorFunction = data[i++];
        this.amount = data[i++];

        this.sparks = [];
        for (let i = 0; i < this.amount; i++) {
            const dir = this.dir + Math.random() * this.randomRange - this.randomRange / 2;
            const radius = Math.random() * this.radius;
            this.sparks.push({ dir, radius });
        }
        return i;
    }

    getData() {
        return super.getData().concat([
            this.dir,
            this.randomRange,
            this.radius,
            this.colorFunction,
            this.amount,
        ]);
    }

    render() {
        const { x, y } = this.game.onScreen(this);
        this.game.ctx.fillStyle = sparksColorFunctions[this.colorFunction]();
        for (const spark of this.sparks) {
            const size = Math.random() * this.game.scale;
            this.game.ctx.beginPath();
            this.game.ctx.moveTo(x, y);
            this.game.ctx.fillRect(
                x + Math.cos(spark.dir) * spark.radius * (this.passTime / this.duration) * this.game.scale,
                y + Math.sin(spark.dir) * spark.radius * (this.passTime / this.duration) * this.game.scale,
                size, size
            )
            this.game.ctx.stroke();
        }
    }

}

try {
    module.exports = Sparks;
} catch (err) { }
