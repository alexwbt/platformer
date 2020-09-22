try {
    collision = require('./collision');
} catch (err) {}

class Game {

    init() {
        this.scale = 10;
        this.camera = { x: 0, y: 0 };

        this.objects = [];
        this.particles = [];
        this.blocks = [];
    }

    setCanvas(canvas, spriteSources) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.sprites = spriteSources.map(src => {
            const image = new Image();
            image.src = src;
            return image;
        });
    }

    spawnObject(object) {
        object.game = this;
        this.objects.push(object);
    }

    spawnParticle() {

    }

    spawnBlock(block) {
        block.game = this;
        this.blocks.push(block);
    }

    getData() {

    }

    setData() {

    }

    update(deltaTime) {
        this.objects.forEach(o => o.update(deltaTime));
    }

    render() {
        if (!this.ctx || !this.canvas)
            return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillStyle = 'skyblue';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.blocks.forEach(b => b.render());
        this.objects.forEach(o => o.render());
    }

    onScreen({ x, y, width, height, shape }) {
        return {
            x: (x - this.camera.x) * this.scale + this.canvas.width / 2,
            y: (y - this.camera.y) * this.scale + this.canvas.height / 2,
            width: width * this.scale,
            height: height * this.scale,
            onScreen: collision({ shape, x, y, width, height },
                { shape: SHAPE_RECT, x: 0, y: 0, width: game.canvas.width, height: game.canvas.height })
        };
    }

}

try { module.exports = Game }
catch (e) { }
