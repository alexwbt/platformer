try {
    GameObject = require('./object');
    Block = require('./object/block');
    Player = require('./object/player');
    Bullet = require('./object/bullet');

    Particle = require('./particle');
    Sparks = require('./particle/sparks');

    collision = require('./collision');
} catch (err) { }

const CLASS_OBJECT = 1;
const CLASS_BLOCK = 2;
const CLASS_PLAYER = 3;
const CLASS_BULLET = 4;

const CLASS_PARTICLE = 5;
const CLASS_SPARKS = 6;

class Game {

    constructor() {
        this.init();
    }

    init() {
        this.scale = 5;
        this.camera = { x: 0, y: 0 };

        this.nextObjectId = 1;

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

    spawnObject(classType, info = {}) {
        const object = (() => {
            info.objectId = this.nextObjectId++;
            info.classType = classType;
            switch (classType) {
                case CLASS_BLOCK: return new Block(this, info);
                case CLASS_PLAYER: return new Player(this, info);
                case CLASS_BULLET: return new Bullet(this, info);
                default: return new GameObject(this, info);
            }
        })();
        (classType === CLASS_BLOCK ? this.blocks : this.objects).push(object);
        return object;
    }

    spawnParticle(classType, info = {}) {
        const particle = (() => {
            info.classType = classType;
            switch (classType) {
                case CLASS_SPARKS: return new Sparks(this, info);
                default: return new Particle(this, info);
            }
        })();
        this.particles.push(particle);
        return particle;
    }

    getData() {
        return {
            particles: this.particles.map(p => p.getData()),
            objects: this.objects.map(o => o.getData()),
            blocks: this.blocks.map(b => b.getData())
        };
    }

    setData(data) {
        this.particles = [];
        this.objects = [];
        this.particles = [];
        data.objects.forEach(data => {
            const particle = this.spawnParticle(data[0]);
            particle.setData(data);
        });
        data.objects.forEach(data => {
            const object = this.spawnObject(data[0]);
            object.setData(data);
        });
        data.blocks.forEach(data => {
            const block = this.spawnObject(data[0]);
            block.setData(data);
        });
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => {
            p.update(deltaTime);
            return !p.removed;
        });
        this.objects.forEach(o => o.update(deltaTime));
        this.objects = this.objects.filter(o => !o.removed);
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

try {
    module.exports = Game

    module.exports.CLASS_OBJECT = CLASS_OBJECT;
    module.exports.CLASS_BLOCK = CLASS_BLOCK;
    module.exports.CLASS_PLAYER = CLASS_PLAYER;
    module.exports.CLASS_BULLET = CLASS_BULLET;

    module.exports.CLASS_PARTICLE = CLASS_PARTICLE;
    module.exports.CLASS_SPARKS = CLASS_SPARKS;
} catch (e) { }
