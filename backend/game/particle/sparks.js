try {
    Particle = require(".");
} catch (err) { }

class Sparks extends Particle {
    class = 'sparks';

    constructor(initInfo) {
        super({
            duration: 0.1,
            dir: 0,
            randomRange: Math.PI * 2,
            radius: 5,
            red: false,
            ...initInfo
        });

        this.sparks = [];
        for (let i = 0; i < 10; i++) {
            const dir = this.dir + Math.random() * this.randomRange - this.randomRange / 2;
            const radius = Math.random() * this.radius;
            this.sparks.push({ dir, radius });
        }
    }

    setInfo(info) {
        super.setInfo(info);
        this.dir = info.dir;
        this.randomRange = info.randomRange;
        this.radius = info.radius;
        this.red = info.red;
    }

    setData(data) {
        let i = super.setData(data);
        this.dir = data[i++];
        this.randomRange = data[i++];
        this.radius = data[i++];
        this.red = data[i++];
        return i;
    }

    getData() {
        return super.getData().concat([
            this.dir,
            this.randomRange,
            this.radius,
            this.red,
        ]);
    }

    render() {
        const { x, y } = this.game.onScreen(this);
        this.game.ctx.fillStyle = `rgba(255, ${this.red ? Math.random() * 255 : Math.random() * 55 + 200}, 0, ${Math.random() * 0.7})`;
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
