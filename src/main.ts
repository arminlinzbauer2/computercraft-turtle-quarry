import {parseArgs} from "./argument-parser";
import {argumentDefinition, ArgumentList} from "./argument-definitions";
import {addDigEventHandler, DigEvent, quarry} from "./quarry";

function onDig(e: DigEvent) {
    print(`Collected ${e.type}`);
}

function main(args: ArgumentList): void {
    addDigEventHandler(onDig);
    quarry(Number(args.width), Number(args.length), Number(args.depth));
}

((...args) => {
    const parsedArgs = parseArgs(argumentDefinition, ...args);
    if (parsedArgs === false) {
        return;
    }
    main(<ArgumentList>parsedArgs);
})(...$vararg);
