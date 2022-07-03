import {MoveDirection, MoveEvent, TurnDirection, TurnEvent} from "./quarry";

type Vector3d = { x: number, y: number, z: number };

enum Orientation {NORTH, EAST, SOUTH, WEST};

let currentPosition: Vector3d = {x: 0, y: 0, z: 0};
let currentOrientation: Orientation = Orientation.NORTH;

function inventoryFull(): boolean {
    return turtle.getItemCount(16) > 0;
}

function returnToStart(): void {
    while (currentOrientation != Orientation.SOUTH) {
        turtle.turnRight();
        onTurn(new TurnEvent(TurnDirection.RIGHT));
    }
    while (currentPosition.z != 0) {
        turtle.up();
        ++currentPosition.z;
    }
    while (currentPosition.y != 0) {
        turtle.forward();
        --currentPosition.y;
    }
    if (currentPosition.x > 0) {
        turtle.turnLeft();
        while (currentPosition.x != 0) {
            turtle.forward();
            --currentPosition.x;
        }
        turtle.turnRight();
    }
}

function dropItems(): void {
    for (let i = 1; i <= 16; i++) {
        turtle.select(i);
        turtle.drop(turtle.getItemCount(i));
    }
    turtle.select(1);
}

function returnToPreviousPosition(returnPosition: Vector3d, returnOrientation: Orientation): void {
    turtle.turnRight();
    onTurn(new TurnEvent(TurnDirection.RIGHT));
    turtle.turnRight();
    onTurn(new TurnEvent(TurnDirection.RIGHT));

    if (returnPosition.x > 0) {
        turtle.turnLeft();
        while (currentPosition.x != returnPosition.x) {
            turtle.forward();
            ++currentPosition.x;
        }
        turtle.turnRight();
    }
    while (currentPosition.y != returnPosition.y) {
        turtle.forward();
        ++currentPosition.y;
    }
    while (currentPosition.z != returnPosition.z) {
        turtle.down();
        --currentPosition.z;
    }

    while (currentOrientation != returnOrientation) {
        turtle.turnRight();
        onTurn(new TurnEvent(TurnDirection.RIGHT));
    }
}

function updateCurrentPosition(direction: MoveDirection): void {
    if (direction == MoveDirection.UP) {
        ++currentPosition.z;
        return;
    }

    if (direction == MoveDirection.DOWN) {
        --currentPosition.z;
        return;
    }

    switch (currentOrientation) {
        case Orientation.NORTH:
            ++currentPosition.y;
            break;
        case Orientation.SOUTH:
            --currentPosition.y;
            break;
        case Orientation.EAST:
            --currentPosition.x;
            break;
        case Orientation.WEST:
            ++currentPosition.x;
            break;
    }
}

function transitionOrientation(direction: TurnDirection, transition: [left: Orientation, right: Orientation]) {
    switch(direction) {
        case TurnDirection.LEFT:
            currentOrientation = transition[0];
            break;
        case TurnDirection.RIGHT:
            currentOrientation = transition[1];
            break;
    }
}

const orientationNames = ["N", "E", "S", "W"];

export function onMove(e: MoveEvent) {
    updateCurrentPosition(e.direction);
    print(`Pos: x:${currentPosition.x} y:${currentPosition.y} z:${currentPosition.z} / ${orientationNames[currentOrientation]}`);

    if (inventoryFull()) {
        const returnPosition = currentPosition;
        const returnOrientation = currentOrientation;
        returnToStart();
        dropItems();
        returnToPreviousPosition(returnPosition, returnOrientation);
    }
}

export function onTurn(e: TurnEvent) {
    switch(currentOrientation) {
        case Orientation.NORTH:
            transitionOrientation(e.direction, [Orientation.WEST, Orientation.EAST])
            break;
        case Orientation.EAST:
            transitionOrientation(e.direction, [Orientation.NORTH, Orientation.SOUTH])
            break;
        case Orientation.SOUTH:
            transitionOrientation(e.direction, [Orientation.EAST, Orientation.WEST])
            break;
        case Orientation.WEST:
            transitionOrientation(e.direction, [Orientation.SOUTH, Orientation.NORTH])
            break;
    }
}

