export function parseArgs(definition: ArgumentDefinition, ...argv: Array<string>): ArgumentList | false {
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

    return _parseArgs(definition, initDefaults(definition), argv);
}

function _parseArgs(definition: ArgumentDefinition, argList: ArgumentList, argv: Array<string>): ArgumentList {
    let foundPositionals = -1;

    for (let i = 0; i < argv.length; i++) {
        const current = argv[i];
        const next = argv.length > i ? argv[i + 1] : null;

        let skip = false;
        for (let arg of definition.flags) {
            if (current === `--${arg.name}` || arg.alias && current === `-${arg.alias}`) {
                argList[arg.name] = true;
                skip = true;
                break;
            }
        }

        if (!skip) {
            for (let arg of definition.args) {
                if (current === `--${arg.name}` || arg.alias && current === `-${arg.alias}`) {
                    if (next == null) {
                        throw Error(`Missing value for argument '${current}'`);
                    }

                    argList[arg.name] = next;
                    ++i;

                    skip = true;
                    break;
                }
                if (current.startsWith(`--${arg.name}=`) || arg.alias && current.startsWith(`-${arg.alias}=`)) {
                    const value = current.split("=")[1];
                    argList[arg.name] = value.length > 0 ? value : null;

                    skip = true;
                    break;
                }
            }
        }

        if (!skip) {
            if (definition.positional[foundPositionals + 1] == null) {
                throw Error("Too many arguments");
            }
            argList[definition.positional[++foundPositionals].name] = current;
        }
    }

    return argList;
}

function initDefaults(definition: ArgumentDefinition): ArgumentList {
    const argList: ArgumentList = {flags: {}, args: {}, positional: {}};

    for (let arg of definition.positional) {
        argList[arg.name] = arg.defaultValue ?? null;
    }
    for (let arg of definition.flags) {
        argList[arg.name] = arg.defaultValue ?? false;
    }
    for (let arg of definition.args) {
        argList[arg.name] = arg.defaultValue ?? null;
    }

    return argList;
}

function getName(definition: ArgumentDefinition): string {
    let version = definition.version ? ` v${definition.version}` : "";
    return `${definition.name}${version}`;
}

function getOptionName(arg: Argument, expectsValue: boolean = false): string {
    let expectedValueMarker = expectsValue ? `=${arg.required ? "<>" : `[${arg.defaultValue ?? ''}]`}` : "";
    let alias = arg.alias ? `|-${arg.alias}` : "";

    return `--${arg.name}${alias}${expectedValueMarker}`;
}

function wrapWithBrackets(text: string, required: boolean = false) {
    return required ?
        `<${text}>` :
        `[${text}]`;
}

function printGroup(args: Argument[], title: string, padLength: number, expectsValue: boolean = false): void {
    if (args.length > 0) {
        print(`${title}:`);
        for (let arg of args) {
            let paddedName = getOptionName(arg, expectsValue).padStart(padLength);
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

    printGroup(definition.flags, "Flags", maxLength);
    printGroup(definition.args, "Options", maxLength, true);
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

export interface ArgumentList extends Record<string, any> {
}