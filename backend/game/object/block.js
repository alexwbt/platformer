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

        switch (this.blockType) {
            case 1:
                super.renderSprite(this.game.sprites[0], 24, 8, 8, 8, x, y, width, height);
                super.renderSprite(this.game.sprites[0], 32, 56, 8, 8, x, y, width, height);
                break;
            case 2:
                super.renderSprite(this.game.sprites[0], 0, 0, 8, 8, x, y, width, height);
                super.renderSprite(this.game.sprites[0], 32, 64, 8, 8, x, y, width, height);
                break;
            default:
                super.renderSprite(this.game.sprites[0], 0, 0, 16, 16, x, y, width, height);
        }
    }

}

try { module.exports = Block; }
catch (err) { }
