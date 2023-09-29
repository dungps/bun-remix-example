import type { ToastMessage } from "~/components/Toast/types"

export enum Event {
    SHOW = "show",
    CLEAR = "clear",
    DID_MOUNT = "did_mount",
    UN_MOUNT = "unmount"
}

export type EventShowCallback = (options?: ToastMessage) => void
export type EventClearCallback = (id: string) => void
export type EventDefaultCallback = (...args: any[]) => void
export type EventCallback = EventShowCallback | EventClearCallback | EventDefaultCallback

export interface EventManager {
    readonly list: Map<Event, EventCallback[]>

    on(event: Event, callback: EventCallback): EventManager

    on(event: Event.SHOW, callback: EventShowCallback): EventManager

    on(event: Event.CLEAR, callback: EventClearCallback): EventManager

    on(event: Event.DID_MOUNT, callback: EventDefaultCallback): EventManager

    on(event: Event.UN_MOUNT, callback: EventDefaultCallback): EventManager

    off(event: Event, callback?: EventCallback): EventManager

    off(event: Event.SHOW, callback?: EventShowCallback): EventManager

    off(event: Event.CLEAR, callback?: EventClearCallback): EventManager

    off(event: Event.DID_MOUNT, callback?: EventDefaultCallback): EventManager

    off(event: Event.UN_MOUNT, callback?: EventDefaultCallback): EventManager

    emit(event: Event, ...args: any[]): EventManager

    emit(event: Event.SHOW, options: ToastMessage): EventManager

    emit(event: Event.CLEAR, id: string): EventManager

    emit(event: Event.DID_MOUNT): EventManager

    emit(event: Event.UN_MOUNT): EventManager

    clear(): EventManager
}

const Events: EventManager = {
    list: new Map<Event, EventCallback[]>(),
    on(event: Event, callback: EventCallback): EventManager {
        this.list.has(event) || this.list.set(event, [])
        this.list.get(event)!.push(callback)
        return this
    },
    off(event: Event, callback?: EventCallback): EventManager {
        if (callback) {
            const cbs = this.list.get(event)!.filter((cb) => cb === callback)
            this.list.set(event, cbs)
        } else {
            this.list.delete(event)
        }

        return this
    },
    emit(event: Event, ...args: any[]): EventManager {
        this.list.has(event) &&
            this.list.get(event)!.forEach((callback: EventCallback) => {
                // @ts-expect-error
                callback(...args)
            })
        return this
    },
    clear(): EventManager {
        this.list.clear()
        return this
    }
}

export default Events
