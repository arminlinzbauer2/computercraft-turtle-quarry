import {createEventHelpers, Event, EventHandlerCollection} from "./event";

export enum MoveDirection {
    FORWARD,
    UP,
    DOWN
}

export enum TurnDirection {
    LEFT,
    RIGHT
}


export class DigEvent extends Event {
    constructor(public type: string) {
        super();
    }
}

export class MoveEvent extends Event {
    constructor(public direction: MoveDirection) {
        super();
    }
}

export class TurnEvent extends Event {
    constructor(public direction: TurnDirection) {
        super();
    }
}

let _digEventHandlers: EventHandlerCollection<DigEvent> = [];
let _moveEventHandlers: EventHandlerCollection<MoveEvent> = [];
let _turnEventHandlers: EventHandlerCollection<TurnEvent> = [];

export const [
    addDigEventHandler,
    removeDigEventHandler,
    dispatchDigEvent
] = createEventHelpers(_digEventHandlers);

export const [
    addMoveEventHandler,
    removeMoveEventHandler,
    dispatchMoveEvent
] = createEventHelpers(_moveEventHandlers);

export const [
    addTurnEventHandler,
    removeTurnEventHandler,
    dispatchTurnEvent
] = createEventHelpers(_turnEventHandlers);


export function quarry(width: number, length: number, depth: number) {
    if (width < 2) {
        throw Error("Width needs to be > 1");
    }

    if (width > 32) {
        throw Error("Width needs to be <= 32");
    }

    if (length < 2) {
        throw Error("Length needs to be > 1");
    }

    if (length > 32) {
        throw Error("Length needs to be <= 32");
    }

    if (depth < 1) {
        throw Error("Depth needs to be > 0");
    }

    if (depth > 64) {
        throw Error("Depth needs to be <= 64");
    }

    const evenWidth = width % 2 == 0;
    let startRight = false;

    while (depth > 1) {
        digPlane(width, length, startRight);
        turtle.down();
        const e = new MoveEvent(MoveDirection.DOWN);
        dispatchMoveEvent(e);

        startRight = evenWidth ? !startRight : startRight;
        --depth;
    }
    digPlane(width, length, startRight);
}

function digPlane(width: number, length: number, startRight: boolean = false) {
    const turn = turner(startRight);
    while (width > 1) {
        digTrench(length);
        turn();
        move();
        turn(true);
        --width;
    }
    digTrench(length);
    turn();
    turn();
}

function digTrench(length: number) {
    while (length > 1) {
        digBlock();
        move();
        --length;
    }
    digBlock();
}

function move() {
    if (turtle.detect()) {
        const [_, blockInfo] = turtle.inspect();
        const digEvent = new DigEvent(blockInfo.name);
        turtle.dig();
        dispatchDigEvent(digEvent);
    }
    turtle.forward();
    const e = new MoveEvent(MoveDirection.FORWARD);
    dispatchMoveEvent(e);
}

function digBlock() {
    const [hasBlock, blockInfo] = turtle.inspectDown();
    if (!hasBlock) {
        return;
    }

    const digEvent = new DigEvent(blockInfo.name);
    turtle.digDown();
    dispatchDigEvent(digEvent);
}

function turner(right: boolean = false) {
    return function (flip: boolean = false) {
        const event = new TurnEvent(right ? TurnDirection.RIGHT : TurnDirection.LEFT);
        right ? turtle.turnRight() : turtle.turnLeft();
        right = flip ? !right : right;
        dispatchTurnEvent(event);
    };
}