const SHAPE_RECT = 1;
const SHAPE_LINE = 2;

const collision = (object1, object2) => {
    switch (`${object1.shape}:${object2.shape}`) {
        case `${SHAPE_RECT}:${SHAPE_RECT}`: return rectVsRect(object1, object2);
        case `${SHAPE_LINE}:${SHAPE_LINE}`: return lineVsLine(object1, object2);

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
 * Returns true if line1 collides with line2.
 * @param {{x1:number, y1:number, x2:number, y2: number}} line1 
 * @param {{x1:number, y1:number, x2:number, y2: number}} line2 
 */
const lineVsLine = (line1, line2) => {
    // calculate the distance to intersection point
    const uA = ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) - (line2.y2 - line2.y1) * (line1.x1 - line2.x1))
        / ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1));
    const uB = ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) - (line1.y2 - line1.y1) * (line1.x1 - line2.x1))
        / ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
        return {
            x: line1.x1 + (uA * (line1.x2 - line1.x1)),
            y: line1.y1 + (uA * (line1.y2 - line1.y1))
        };
    return false;
};

/**
 * Returns true if line collides with rect.
 * @param {{x1:number, y1:number, x2:number, y2: number}} line 
 * @param {{x: number, y: number, width: number, height: number}} rect 
 */
const lineVsRect = (line, rect) => {
    // check if the line has hit any of the rectangle's sides
    const left = lineVsLine(line, { x1: rect.x, y1: rect.y, x2: rect.x, y2: rect.y + rect.height });
    const right = lineVsLine(line, { x1: rect.x + rect.width, y1: rect.y, x2: rect.x + rect.width, y2: rect.y + rect.height });
    const top = lineVsLine(line, { x1: rect.x, y1: rect.y, x2: rect.x + rect.width, y2: rect.y });
    const bottom = lineVsLine(line, { x1: rect.x, y1: rect.y + rect.height, x2: rect.x + rect.width, y2: rect.y + rect.height });
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
