import {ArgumentDefinition, ArgumentList as _ArgumentList} from "./argument-parser";
import {command, description, name, version} from "./meta";

export const argumentDefinition: ArgumentDefinition = {
    name: name,
    version: version,
    command: command,
    description: description,
    flags: [
        {name: "force", alias: "f", description: "Ignore fuel level"},
        {name: "return", alias: "r", description: "Return to start"},
        {name: "refuel", alias: "a", description: "Refuel with coal"},
        {name: "dropoff", alias: "d", description: "Drop to chest"},
    ],
    args: [
        {name: "width", defaultValue: 10, description: "Quarry width"},
        {name: "length", defaultValue: 10, description: "Quarry length"},
        {name: "depth", defaultValue: 50, description: "Quarry depth"}
    ],
    positional: []
};

export interface ArgumentList extends _ArgumentList {
    width: number,
    length: number,
    depth: number,
    force: boolean,
    return: boolean,
    refuel: boolean,
    dropoff: boolean,
}