import {ArgumentList, parseArgs} from './argument-parser'
import {argumentDefinition} from "./argument-definitions";

function main(args: ArgumentList): void {

}

((...args) => {
    const parsedArgs = parseArgs(argumentDefinition, ...args)
    if (parsedArgs === false) {
        return;
    }
    main(parsedArgs)
})(...$vararg)
