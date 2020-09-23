try {
    GameObject = require(".");
} catch (err) { }

class Block extends GameObject {
    class = 'block';

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

        this.renderSprite(this.game.sprites[0], 0, 0, 16, 16, x, y, width, height);
    }

}

try { module.exports = Block; }
catch (err) { }
