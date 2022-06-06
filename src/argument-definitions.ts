import {ArgumentDefinition} from "./argument-parser";
import {command, description, name, version} from "./meta";

export const argumentDefinition: ArgumentDefinition = {
    name: name,
    version: version,
    command: command,
    description: description,
    flags: [
        { name: "force", alias: "f", description: "Ignore fuel level" },
        { name: "return", alias: "r", description: "Return to start" },
        { name: "refuel", alias: "a", description: "Refuel with coal" },
        { name: "dropoff", alias: "d", description: "Drop to chest" },
    ],
    args: [],
    positional: [
        { name: 'width', defaultValue: 10 },
        { name: 'length', defaultValue: 10 },
        { name: 'depth', defaultValue: 50 }
    ]
};