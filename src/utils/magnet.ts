
import type { CubeType } from "../components/Board/types";
import { CUBE_SIZE, SNAP_THRESHOLD } from "./consts";

const isOverlapping = (
    firstCubePosition: { x: number; y: number },
    secondCubePosition: { x: number; y: number }
) => {
    const firstCubeLeft = firstCubePosition.x;
    const firstCubeRight = firstCubePosition.x + CUBE_SIZE;
    const firstCubeTop = firstCubePosition.y;
    const firstCubeBottom = firstCubePosition.y + CUBE_SIZE;

    const secondCubeLeft = secondCubePosition.x;
    const secondCubeRight = secondCubePosition.x + CUBE_SIZE;
    const secondCubeTop = secondCubePosition.y;
    const secondCubeBottom = secondCubePosition.y + CUBE_SIZE;

    return (
        firstCubeRight > secondCubeLeft &&
        firstCubeLeft < secondCubeRight &&
        firstCubeBottom > secondCubeTop &&
        firstCubeTop < secondCubeBottom
    );
};
const isTouching = (
    firstCubePosition: { x: number; y: number },
    secondCubePosition: { x: number; y: number }
) => {
    const firstCubeLeft = firstCubePosition.x;
    const firstCubeRight = firstCubePosition.x + CUBE_SIZE;
    const firstCubeTop = firstCubePosition.y;
    const firstCubeBottom = firstCubePosition.y + CUBE_SIZE;

    const secondCubeLeft = secondCubePosition.x;
    const secondCubeRight = secondCubePosition.x + CUBE_SIZE;
    const secondCubeTop = secondCubePosition.y;
    const secondCubeBottom = secondCubePosition.y + CUBE_SIZE;

    const EPS = SNAP_THRESHOLD;

    const isClose = (v1: number, v2: number) =>
        Math.abs(v1 - v2) < EPS;

    const overlapX = firstCubeRight > secondCubeLeft && firstCubeLeft < secondCubeRight;
    const overlapY = firstCubeBottom > secondCubeTop && firstCubeTop < secondCubeBottom;

    const touchX =
        isClose(firstCubeRight, secondCubeLeft) || isClose(firstCubeLeft, secondCubeRight);

    const touchY =
        isClose(firstCubeBottom, secondCubeTop) || isClose(firstCubeTop, secondCubeBottom);

    return (touchX && overlapY) || (touchY && overlapX);
};

export const applyMagnet = (
    movingCubePosition: { x: number; y: number },
    target: CubeType
) => {
    let { x, y } = movingCubePosition;

    const movingCubeLeft = x;
    const movingCubeRight = x + CUBE_SIZE;
    const movingCubeTop = y;
    const movingCubeBottom = y + CUBE_SIZE;

    const targetCubeLeft = target.position.x;
    const targetCubeRight = target.position.x + CUBE_SIZE;
    const targetCubeTop = target.position.y;
    const targetCubeBottom = target.position.y + CUBE_SIZE;

    // пересечения
    const overlapX =
        movingCubeRight > targetCubeLeft &&
        movingCubeLeft < targetCubeRight;

    const overlapY =
        movingCubeBottom > targetCubeTop &&
        movingCubeTop < targetCubeBottom;

    // расстояния
    const distanceToLeft = Math.abs(movingCubeLeft - targetCubeRight);
    const distanceToRight = Math.abs(movingCubeRight - targetCubeLeft);
    const distanceToTop = Math.abs(movingCubeTop - targetCubeBottom);
    const distanceToBottom = Math.abs(movingCubeBottom - targetCubeTop);

    const minDistanceX = Math.min(distanceToLeft, distanceToRight);
    const minDistanceY = Math.min(distanceToTop, distanceToBottom);


    if (minDistanceX < minDistanceY) {
        // X 
        if (distanceToLeft < SNAP_THRESHOLD && overlapY) {
            x = targetCubeRight;
        } else if (distanceToRight < SNAP_THRESHOLD && overlapY) {
            x = targetCubeLeft - CUBE_SIZE;
        }
    } else {
        // Y
        if (distanceToTop < SNAP_THRESHOLD && overlapX) {
            y = targetCubeBottom;
        } else if (distanceToBottom < SNAP_THRESHOLD && overlapX) {
            y = targetCubeTop - CUBE_SIZE;
        }
    }

    return { x, y };
};

export const isInGroup = (
    firstCubePosition: { x: number; y: number },
    secondCubePosition: { x: number; y: number }
) => {
    return isOverlapping(firstCubePosition, secondCubePosition) || isTouching(firstCubePosition, secondCubePosition);
};

export const clampGroupWithDelta = (
    groupOffsetByX: number,
    groupOffsetByY: number,
    firstCubePosition: { x: number; y: number },
    secondCubePosition: { x: number; y: number },
    boardRect: DOMRect
) => {
    let newDx = groupOffsetByX;
    let newDy = groupOffsetByY;

    const aNext = {
        x: firstCubePosition.x + newDx,
        y: firstCubePosition.y + newDy
    };

    const bNext = {
        x: secondCubePosition.x + newDx,
        y: secondCubePosition.y + newDy
    };

    const minX = Math.min(aNext.x, bNext.x);
    const maxX = Math.max(aNext.x, bNext.x) + CUBE_SIZE;

    const minY = Math.min(aNext.y, bNext.y);
    const maxY = Math.max(aNext.y, bNext.y) + CUBE_SIZE;

    // корректировка X
    if (minX < 0) {
        newDx += -minX;
    }
    if (maxX > boardRect.width) {
        newDx -= maxX - boardRect.width;
    }

    // корректировка Y
    if (minY < 0) {
        newDy += -minY;
    }
    if (maxY > boardRect.height) {
        newDy -= maxY - boardRect.height;
    }

    return { dx: newDx, dy: newDy };
};

export const generateRandomPositions = (boardSize: number) => {
    const getRandomPosition = () => ({
        x: Math.floor(Math.random() * (boardSize - CUBE_SIZE)),
        y: Math.floor(Math.random() * (boardSize - CUBE_SIZE))
    });

    let firstCubePosition, secondCubePosition;

    do {
        firstCubePosition = getRandomPosition();
        secondCubePosition = getRandomPosition();
    } while (
        isOverlapping(firstCubePosition, secondCubePosition) ||
        isTouching(firstCubePosition, secondCubePosition)
    );

    return [firstCubePosition, secondCubePosition];
};