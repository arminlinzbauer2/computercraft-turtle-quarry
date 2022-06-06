export function parseArgs(definition: ArgumentDefinition, ...argv: Array<string>): ArgumentList | false {
    const argList = {flags: {}, args: {}, positional: {}};

    definition.flags.push({
        name: 'help',
        alias: '?',
        description: 'Print usage'
    });

    definition.flags.push({
        name: 'version',
        alias: 'V',
        description: 'Print version'
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
    const name = `${definition.name}${definition.version ? ` v${definition.version}` : undefined}`;
    return name;
}

function getOptionName(arg: Argument, expectsValue: boolean = false): string {
    return `--${arg.name}${arg.alias ? `|-${arg.alias}` : undefined}${expectsValue ? `=${arg.required ? '<>' : '[]'}` : ''}`;
}

function printHelpText(definition: ArgumentDefinition): void {
    write(getName(definition));

    if (definition.description) {
        print(` - ${definition.description}`);
    }

    const posArgs = definition.positional
        .map(arg =>
            `${arg.required ? '<' : '['}${arg.name}${arg.defaultValue ? `(${arg.defaultValue})` : undefined}${arg.required ? '>' : ']'}`)
        .join(' ');

    print(`\nSynopsis: ${definition.command} [options] -- ${posArgs}\n`);

    let maxLength: number = definition.flags.reduce((acc: number, arg: Argument): number => {
        const length = getOptionName(arg).length;
        if (length > acc) {
            return length;
        }
        return acc;
    }, 0);

    maxLength = definition.args.reduce((acc: number, arg: Argument): number => {
        const length = getOptionName(arg, true).length;
        if (length > acc) {
            return length;
        }
        return acc;
    }, maxLength);

    if(definition.flags.length > 0) {
        print('Flags:');
        for (let arg of definition.flags) {
            print(`${getOptionName(arg).padStart(maxLength)}${arg.description ? ` - ${arg.description}` : undefined}`)
        }
    }
    if(definition.args.length > 0) {
        print('Options:');
        for (let arg of definition.args) {
            print(`${getOptionName(arg, true).padStart(maxLength)}${arg.description ? ` - ${arg.description}` : undefined}`)
        }
    }
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