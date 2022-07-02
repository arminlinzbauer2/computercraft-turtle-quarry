/**
 * Basic cancellable event
 */
export class Event {
    private _cancelled: boolean = false;

    public cancel() {
        this._cancelled = true;
    }

    public get cancelled() {
        return this._cancelled;
    }
}

/**
 * Function that is executed when an Event is dispatched
 * by an EventDispatcher
 */
export type EventHandler<T extends Event> = (e: T) => void;

/**
 * A collection of EventHandlers
 */
export type EventHandlerCollection<T extends Event> = EventHandler<T>[]

/**
 * Dispatches EventHandlers within an EventHandlerCollection when
 * an Event is dispatched by an EventDispatcher
 */
export type EventDispatcherFunction<T extends Event> = (event: T) => void;

/**
 * Adds the specified EventHandler to the
 * EventHandlerCollection
 * @param handler
 */
export type AddEventHandlerFunction<T extends Event> = (
    handler: EventHandler<T>
) => void

/**
 * Removes the specified EventHandler from the
 * EventHandlerCollection
 * @param handler
 */
export type RemoveEventHandlerFunction<T extends Event> = (
    handler: EventHandler<T>
) => void

/**
 * Adds the specified EventHandler to an
 * EventHandlerCollection
 * @param collection
 * @param handler
 */
function _addEventHandler<T extends Event>(
    collection: EventHandlerCollection<T>,
    handler: EventHandler<T>
): void {
    if (collection.indexOf(handler) < 0) {
        collection.push(handler);
    }
}

/**
 * Removes the specified EventHandler from an
 * EventHandlerCollection
 * @param collection
 * @param handler
 */
function _removeEventHandler<T extends Event>(
    collection: EventHandlerCollection<T>,
    handler: EventHandler<T>
): void {
    const idx = collection.indexOf(handler);
    if (idx > -1) {
        collection.splice(idx, 1);
    }
}

/**
 * EventHandler helper functions for adding and removing
 * EventHandler instances from EventHandlerCollection
 */
export type EventHelpers<T extends Event> = [
    AddEventHandlerFunction<T>,
    RemoveEventHandlerFunction<T>,
    EventDispatcherFunction<T>
];

/**
 * Creates helper functions for adding EventHandlers
 * and dispatching Events
 * @param collection
 */
export function createEventHelpers<T extends Event>(
    collection: EventHandlerCollection<T>
): EventHelpers<T> {
    return [
        (handler: EventHandler<T>) => _addEventHandler(collection, handler),
        (handler: EventHandler<T>) => _removeEventHandler(collection, handler),
        createEventDispatcher(collection)
    ];
}

/**
 * Creates a new EventDispatcher<?> instance
 * @param collection
 */
export function createEventDispatcher<T extends Event>(
    collection: EventHandlerCollection<T>
): EventDispatcherFunction<T> {
    return function dispatch(event: T): void {
        for (let handler of collection) {
            if (event.cancelled) {
                return;
            }
            handler(event);
        }
    };
}