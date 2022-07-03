interface Shell {
    exit(): void;
}

interface TextUtils {
    serialize(t: any, opts?: any): string;
}


declare function write(args: any);
declare namespace turtle {
    export function detect(): boolean;

    export function select(slot: number): void;

    export function getItemCount(slot: number): number;

    export function drop(amount: number): void;

    export function detectDown(): boolean;

    export function dig(): void;

    export function digDown(): void;

    export function turnLeft(): void;

    export function turnRight(): void;

    export function forward(): void;

    export function back(): void;

    export function up(): void;

    export function down(): void;

    export function inspect(): LuaMultiReturn<[boolean, Record<string, any>]>;

    export function inspectDown(): LuaMultiReturn<[boolean, Record<string, any>]>;
}