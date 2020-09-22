const SHAPE_RECT = 1;

const collision = (object1, object2) => {
    switch (`${object1.shape}:${object2.shape}`) {
        case `${SHAPE_RECT}:${SHAPE_RECT}`: return rectVsRect(object1, object2);
        default: return false;
    }
};

/**
 * Returns true if Rect1 collides with Rect2.
 * @param {x: number, y: number, width: number, height: number} rect1 
 * @param {x: number, y: number, width: number, height: number} rect2 
 */
const rectVsRect = (rect1, rect2) =>
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y

try {
    module.exports = {
        SHAPE_RECT,
        collision
    };
} catch (err) { }