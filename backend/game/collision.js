const SHAPE_RECT = 1;
const SHAPE_LINE = 2;

const collision = (object1, object2) => {
    switch (`${object1.shape}:${object2.shape}`) {
        case `${SHAPE_RECT}:${SHAPE_RECT}`: return rectVsRect(object1, object2);

        case `${SHAPE_LINE}:${SHAPE_RECT}`: return lineVsRect(object1, object2);
        case `${SHAPE_RECT}:${SHAPE_LINE}`: return lineVsRect(object2, object1);
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


/**
 * Returns true if line(x1, y1, x2, y2) collides with line(x3, y3, x4, y4).
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} x3 
 * @param {number} y3 
 * @param {number} x4 
 * @param {number} y4 
 */
const lineVsLine = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    // calculate the distance to intersection point
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
        return {
            x: x1 + (uA * (x2 - x1)),
            y: y1 + (uA * (y2 - y1))
        };
    return false;
};

/**
 * Returns true if line collides with rect.
 * @param {x1:{number}, y1:{number}, x2:{number}, y2: {number}} line 
 * @param {{x: number, y: number, width: number, height: number}} rect 
 */
const lineVsRect = (line, rect) => {
    // check if the line has hit any of the rectangle's sides
    const left = lineVsLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x, rect.y + rect.height);
    const right = lineVsLine(line.x1, line.y1, line.x2, line.y2, rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + rect.height);
    const top = lineVsLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y, rect.x + rect.width, rect.y);
    const bottom = lineVsLine(line.x1, line.y1, line.x2, line.y2, rect.x, rect.y + rect.height, rect.x + rect.width, rect.y + rect.height);
    if (!left && !right && !top && !bottom) return false;
    return [left, right, top, bottom];
};

try {
    module.exports = {
        SHAPE_RECT,
        SHAPE_LINE,
        collision
    };
} catch (err) { }
