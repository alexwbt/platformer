try {
    GameObject = require(".");
} catch (err) { }

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
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;

        this.renderSprite(this.game.sprites[0], 0, 0, 16, 16, x, y, width, height);
    }

}

try { module.exports = Block; }
catch (err) { }
