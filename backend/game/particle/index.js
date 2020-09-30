
class Particle {

    constructor(game, initInfo) {
        this.game = game;
        this.setInfo({
            classType: 0,
            x: 0,
            y: 0,
            duration: 0,
            passTime: 0,
            ...initInfo
        });
    }

    setInfo(info) {
        this.classType = info.classType;
        this.x = info.x;
        this.y = info.y;
        this.duration = info.duration;
        this.passTime = info.passTime;
    }

    setData(data) {
        let i = 0;
        this.classType = data[i++];
        this.x = data[i++];
        this.y = data[i++];
        this.duration = data[i++];
        this.passTime = data[i++];
        return i;
    }

    getData() {
        return [
            this.classType,
            this.x,
            this.y,
            this.duration,
            this.passTime,
        ];
    }

    update(deltaTime) {
        this.passTime += deltaTime;
        if (this.passTime >= this.duration)
            this.removed = true;
    }

    render() {

    }

}

try {
    module.exports = Particle;
} catch (err) { }
