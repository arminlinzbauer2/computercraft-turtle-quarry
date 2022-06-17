export function parseArgs(definition: ArgumentDefinition, ...argv: Array<string>): ArgumentList | false {
    const argList = {flags: {}, args: {}, positional: {}};

    definition.flags.push({
        name: "help",
        alias: "?",
        description: "Print usage"
    });

    definition.flags.push({
        name: "version",
        alias: "V",
        description: "Print version"
    });

    for (let arg of argv) {
        if (arg === "--help" || arg === "-?") {
            printHelpText(definition);
            return false;
        }

        if (arg === "--version" || arg === "-V") {
            print(getName(definition));
            return false;
        }
    }

    return argList;
}

function getName(definition: ArgumentDefinition): string {
    let version = definition.version ? ` v${definition.version}` : "";
    return `${definition.name}${version}`;
}

function getOptionName(arg: Argument, expectsValue: boolean = false): string {
    let expectedValueMarker = expectsValue ? `=${arg.required ? "<>" : "[]"}` : "";
    let alias = arg.alias ? `|-${arg.alias}` : "";

    return `--${arg.name}${alias}${expectedValueMarker}`;
}

function wrapWithBrackets(text: string, required: boolean = false) {
    return required ?
        `<${text}>` :
        `[${text}]`;
}

function printGroup(args: Argument[], title: string, padLength: number): void {
    if (args.length > 0) {
        print("Flags:");
        for (let arg of args) {
            let paddedName = getOptionName(arg).padStart(padLength);
            let description = arg.description ? ` - ${arg.description}` : "";
            print(`${paddedName}${description}`);
        }
    }
}

function getMaxArgNameLength(args: Argument[], expectsValue: boolean = false, startLength: number = 0) {
    return args.reduce((acc: number, arg: Argument): number => {
        const length = getOptionName(arg, expectsValue).length;
        if (length > acc) {
            return length;
        }
        return acc;
    }, startLength);
}

function getPositionalArgHelp(arg: Argument) {
    const defaultValue = arg.defaultValue ? `(${arg.defaultValue})` : "";
    return wrapWithBrackets(`${arg.name}${defaultValue}`, arg.required);
}

function getPositionalArgsHelp(args: Argument[]) {
    return args.map((a) => getPositionalArgHelp(a)).join(" ");
}

function printHelpText(definition: ArgumentDefinition): void {
    write(getName(definition));

    if (definition.description) {
        print(` - ${definition.description}`);
    }

    const posArgs = getPositionalArgsHelp(definition.positional);
    const posArgsText = definition.positional.length > 0 ?
        ` -- ${posArgs}` :
        "";
    const optionsPlaceholder = definition.flags.length > 0 || definition.args.length > 0 ?
        " [options]" :
        "";

    print(`\nSynopsis: ${definition.command}${optionsPlaceholder}${posArgsText}\n`);

    const maxLength = getMaxArgNameLength(
        definition.args,
        true,
        getMaxArgNameLength(definition.flags)
    );

    printGroup(definition.flags, "Flags:", maxLength);
    printGroup(definition.args, "Options:", maxLength);
}

export interface ArgumentDefinition extends Object {
    name: string,
    command: string,
    version?: string,
    description?: string,
    flags: Array<Argument>,
    args: Array<Argument>,
    positional: Array<Argument>
}

export interface Argument extends Object {
    name: string,
    alias?: string,
    description?: string,
    required?: boolean,
    dependsOn?: Array<Argument>,
    conflictsWith?: Array<Argument>,
    defaultValue?: any
}

export interface ArgumentList extends Object {
    flags: Object,
    args: Object,
    positional: Object,
}