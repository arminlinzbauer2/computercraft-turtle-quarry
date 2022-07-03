import {parseArgs} from "./argument-parser";
import {argumentDefinition, ArgumentList} from "./argument-definitions";
import {addMoveEventHandler, addTurnEventHandler, quarry} from "./quarry";
import {onMove, onTurn} from "./track-position";


function main(args: ArgumentList): void {
    addTurnEventHandler(onTurn);
    addMoveEventHandler(onMove);
    quarry(Number(args.width), Number(args.length), Number(args.depth));
}

((...args) => {
    const parsedArgs = parseArgs(argumentDefinition, ...args);
    if (parsedArgs === false) {
        return;
    }
    main(<ArgumentList>parsedArgs);
})(...$vararg);
