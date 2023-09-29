import { useEffect, useRef, useState } from "react"
import type { Position, ToastMessage } from "~/components/Toast/types"
import events, { Event } from "~/components/Toast/event"
import Toast from "~/components/Toast/Toast"
import Alert from "~/components/Alert"

const timeouts: any[] = []

export interface ToastContainerProps {
    position?: Position
    duration?: number
}

export default function ToastContainer({
    position = "top-right",
    duration = 5000
}: ToastContainerProps) {
    const alerts = useRef<Map<string, ToastMessage>>(new Map()).current
    const [, setToastIds] = useState<Array<string>>([])

    useEffect(() => {
        events
            .on(Event.SHOW, (opts: ToastMessage) => {
                alerts.set(opts.id, {
                    position,
                    duration,
                    type: "success",
                    ...opts
                })
                setToastIds((state) => [...state, opts.id].filter((i) => i !== opts.id))
                timeouts.push(
                    setTimeout(() => {
                        events.emit(Event.CLEAR, opts.id)
                    }, opts.duration || duration)
                )
            })
            .on(Event.CLEAR, (id: string) => {
                alerts.delete(id)
                setToastIds((state) => state.filter((i) => i !== id))
            })
            .emit(Event.DID_MOUNT)

        return () => {}
    })

    function getToastToRender<T>(cb: (position: Position, toastList: ToastMessage[]) => T) {
        const toRender = new Map<Position, ToastMessage[]>()
        const collection = Array.from(alerts.values())

        collection.reverse()

        collection.forEach((toast) => {
            toRender.has(toast.position || position) || toRender.set(toast.position || position, [])
            toRender.get(toast.position || position)!.push(toast)
        })

        return Array.from(toRender, (p) => cb(p[0], p[1]))
    }

    return (
        <>
            {getToastToRender((position, toastList) => {
                return (
                    <Toast position={position} key={position}>
                        {toastList.map((toast, idx) => {
                            return (
                                <Alert key={idx} status={toast.type}>
                                    {toast.message}
                                </Alert>
                            )
                        })}
                    </Toast>
                )
            })}
        </>
    )
}
