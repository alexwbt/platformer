try {
    GameObject = require(".");
} catch (err) { }

class Block extends GameObject {

    constructor(game, initInfo) {
        super(game, {
            blockType: 1,
            width: 10,
            height: 10,
            ...initInfo
        });
    }

    setInfo(info) {
        super.setInfo(info);
        this.blockType = info.blockType;
    }

    setData(data) {
        let i = super.setData(data);
        this.blockType = data[i++];
        return i;
    }

    getData() {
        return super.getData().concat([
            this.blockType,
        ]);
    }

    update() {

    }

    render() {
        const { x, y, width, height, onScreen } = this.game.onScreen(this);
        if (!onScreen) return;

        const spriteSize = 8;
        const spriteX = ((this.blockType - 1) % 8) * spriteSize;
        const spriteY = Math.floor((this.blockType - 1) / 8) * spriteSize;
        
        super.renderSprite(this.game.sprites[0], spriteX, spriteY, spriteSize, spriteSize, x, y, width, height);
    }

}

try { module.exports = Block; }
catch (err) { }
