try {
    GameObject = require(".");
} catch (err) {}

class Block extends GameObject {

    constructor(initInfo) {
        super({
            blockType: 0,
            width: 10,
            height: 10,
            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.blockType = info.blockType;
    }

    update() {

    }

    render() {
        this.renderSprite(this.game.sprites[0], 0, 33, 7, 7);
    }

}

try { module.exports = Block; }
catch (err) { }
