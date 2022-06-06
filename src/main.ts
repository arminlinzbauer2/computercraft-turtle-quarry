function main(...argv: Array<string>): void {
    for(let arg of argv) {
        print(arg);
    }
}

main(...$vararg)