import type { ReactNode } from "react"
import type { ToastMessage } from "~/components/Toast/types"
import events, { Event } from "./event"

const queue: ToastMessage[] = []
let didMount = false

events
    .on(Event.DID_MOUNT, () => {
        didMount = true
        queue.forEach((args) => {
            events.emit(Event.SHOW, args)
        })
    })
    .on(Event.UN_MOUNT, () => {
        events.off(Event.SHOW)
    })

export const toast = (message: ReactNode, options?: Omit<ToastMessage, "message" | "id">) => {
    if (!didMount) {
        queue.push({ message, type: "success", ...options, id: crypto.randomUUID() })
    } else {
        events.emit(Event.SHOW, {
            message,
            type: "success",
            ...options,
            id: crypto.randomUUID()
        })
    }
}

export const success = (message: ReactNode) => {
    toast(message, {
        type: "success"
    })
}

export const error = (message: ReactNode) => {
    toast(message, {
        type: "danger"
    })
}

export const info = (message: ReactNode) => {
    toast(message, {
        type: "info"
    })
}

export const warning = (message: ReactNode) => {
    toast(message, {
        type: "warning"
    })
}

export { default as ToastContainer } from "./ToastContainer"
