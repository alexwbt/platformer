try {
    collision = require('./collision');
} catch (err) { }

class Game {

    init() {
        this.scale = 5;
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

    spawnParticle(particle) {
        particle.game = this;
        this.particles.push(particle);
    }

    spawnBlock(block) {
        block.game = this;
        this.blocks.push(block);
    }

    getData() {
        return {
            particles: this.particles.map(p => p.getData()),
            objects: this.objects.map(o => o.getData())
        };
    }

    setData(data) {
        this.particles = data.particles.map(pData => {
            
        });
        this.objects = data.objects;
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => {
            p.update(deltaTime);
            return !p.removed;
        });
        this.objects = this.objects.filter(o => {
            o.update(deltaTime);
            return !o.removed;
        });
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
        this.particles.forEach(p => p.render());
    }

    onScreen({ x, y, width, height, shape }) {
        const screenX = (x - this.camera.x) * this.scale + this.canvas.width / 2;
        const screenY = (y - this.camera.y) * this.scale + this.canvas.height / 2;
        const screenWidth = width * this.scale;
        const screenHeight = height * this.scale;
        return {
            x: screenX,
            y: screenY,
            width: screenWidth,
            height: screenHeight,
            onScreen: collision({
                shape,
                x: screenX,
                y: screenY,
                width: screenWidth,
                height: screenHeight,
            }, {
                shape: SHAPE_RECT,
                x: 0,
                y: 0,
                width: game.canvas.width,
                height: game.canvas.height
            })
        };
    }

    inGame(x, y) {
        return {
            x: (x - this.canvas.width / 2) / this.scale + this.camera.x,
            y: (y - this.canvas.height / 2) / this.scale + this.camera.y
        };
    }

}

try { module.exports = Game }
catch (e) { }
