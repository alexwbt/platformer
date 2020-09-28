try {
    GameObject = require('./object');
    Block = require('./object/block');
    Character = require('./object/character');
    Bullet = require('./object/bullet');
    Mob = require('./object/mob');
    Coin = require('./object/coin');

    Particle = require('./particle');
    Sparks = require('./particle/sparks');
    Fire = require('./particle/fire');

    collision = require('./collision').collision;

    CLASS_OBJECT = require('./classes').CLASS_OBJECT;
    CLASS_BLOCK = require('./classes').CLASS_BLOCK;
    CLASS_CHARACTER = require('./classes').CLASS_CHARACTER;
    CLASS_BULLET = require('./classes').CLASS_BULLET;
    CLASS_MOB = require('./classes').CLASS_MOB;
    CLASS_COIN = require('./classes').CLASS_COIN;

    CLASS_PARTICLE = require('./classes').CLASS_PARTICLE;
    CLASS_SPARKS = require('./classes').CLASS_SPARKS;
    CLASS_FIRE = require('./classes').CLASS_FIRE;
} catch (err) { }

class Game {

    constructor() {
        this.init();
    }

    init() {
        this.scale = 5;
        this.camera = { x: 0, y: 0 };
        this.cameraFocusId = 0;

        this.nextObjectId = 1;

        this.objects = [];
        this.particles = [];
        this.blocks = [];
        this.decorationBlocks = [];
        this.spawnList = [];

        this.updatedBlocks = false;
        this.updatedDecorationBlock = false;
        this.updatedMapData = false;

        this.playerSpawnPoints = [];
        this.mobSpawnPoints = [];
        this.deadline = 0;
        this.mapData = false;
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

    spawnObject(classType, info = {}, getId = true) {
        const object = (() => {
            if (getId) info.objectId = this.nextObjectId++;
            info.classType = classType;
            switch (classType) {
                case CLASS_BLOCK: return new Block(this, info);
                case CLASS_CHARACTER: return new Character(this, info);
                case CLASS_BULLET: return new Bullet(this, info);
                case CLASS_MOB: return new Mob(this, info);
                case CLASS_COIN: return new Coin(this, info);
                default: return new GameObject(this, info);
            }
        })();
        if (classType === CLASS_CHARACTER && this.playerSpawnPoints.length > 0) {
            const spawnPoint = this.playerSpawnPoints[Math.floor(Math.random() * this.playerSpawnPoints.length)];
            object.x = spawnPoint.x;
            object.y = spawnPoint.y;
        } else if (classType === CLASS_BLOCK) {
            this.updatedBlocks = true;
            if (getId) for (const block of this.blocks)
                if (block.x === object.x && block.y === object.y)
                    return object;
            this.blocks.push(object);
            return object;
        }
        this.objects.push(object);
        return object;
    }

    spawnDecorationBlock(classType, info = {}) {
        const object = (() => {
            info.classType = classType;
            switch (classType) {
                case CLASS_BLOCK: return new Block(this, info);
                default: return new GameObject(this, info);
            }
        })();
        this.decorationBlocks.push(object);
        this.updatedDecorationBlock = true;
        return object;
    }

    spawnParticle(classType, info = {}) {
        const particle = (() => {
            info.classType = classType;
            switch (classType) {
                case CLASS_SPARKS: return new Sparks(this, info);
                case CLASS_FIRE: return new Fire(this, info);
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
        };
    }

    setData(data) {
        if (data.particles) {
            this.particles.length = 0;
            data.particles.forEach(data => {
                const particle = this.spawnParticle(data[0]);
                particle.setData(data);
            });
        }
        if (data.objects) {
            this.objects.length = 0;
            data.objects.forEach(data => {
                const object = this.spawnObject(data[0], {}, false);
                object.setData(data);
            });
        }
        if (data.blocks) {
            this.blocks.length = 0;
            data.blocks.forEach(data => {
                const block = this.spawnObject(data[0], {}, false);
                block.setData(data);
            });
        }
        if (data.decorationBlocks) {
            this.decorationBlocks.length = 0;
            data.decorationBlocks.forEach(data => {
                const block = this.spawnDecorationBlock(data[0], {});
                block.setData(data);
            });
        }
        if (data.mapData) {
            this.mapData = data.mapData;
        }
        if (data.bounds) {
            this.bounds = data.bounds;
        }
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => {
            p.update(deltaTime);
            return !p.removed;
        });
        this.objects.forEach(o => {
            if (this.cameraFocusId && o.objectId === this.cameraFocusId) {
                this.camera.x = o.x + o.width / 2;
                this.camera.y = o.y + o.height / 2;
            }
            o.update(deltaTime);
        });
        this.objects = this.objects.filter(o => !o.removed);
    }

    render() {
        if (!this.ctx || !this.canvas)
            return;

        // this.scale = Math.max(this.canvas.width, this.canvas.height) / 300;

        // const { x, y, height } = this.onScreen({ x: 0, y: -100, height: 500 });
        // const skyGradient = this.ctx.createLinearGradient(x, y, x, height);
        // skyGradient.addColorStop(0, '#070B34');
        // skyGradient.addColorStop(0.2, '#141852');
        // skyGradient.addColorStop(0.4, '#2B2F77');
        // skyGradient.addColorStop(0.6, '#483475');
        // skyGradient.addColorStop(0.8, '#6B4984');
        // skyGradient.addColorStop(1, '#855988');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.fillStyle = '#070B34';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.imageSmoothingEnabled = false;
        this.blocks.forEach(b => b.render());
        this.decorationBlocks.forEach(b => b.render());
        this.objects.forEach(o => {
            o.render();
            if (this.cameraFocusId && o.objectId === this.cameraFocusId && o.weapon) {
                o.renderInfo();
                o.weapon.renderInfo();
            }
        });
        this.particles.forEach(p => p.render());

        if (this.renderGrid && this.mapData && this.bounds) {
            this.ctx.strokeStyle = 'red';
            this.ctx.lineWidth = 1;
            const gridSize = 10 * this.scale;
            const os = this.onScreen({ x: 0, y: 0 });
            for (let x = os.x % gridSize; x < this.canvas.width; x += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }
            for (let y = os.y % gridSize; y < this.canvas.height; y += gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
        }
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
            onScreen: !width || !height ? true : collision({
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

}

try {
    module.exports = Game;
} catch (e) { }
