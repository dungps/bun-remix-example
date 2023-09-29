import type { AlertProps } from "~/components/Alert"
import type { ReactNode } from "react"

export type Position =
    | "top-left"
    | "top-center"
    | "top-right"
    | "center"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"

export interface ToastMessage {
    id: string
    position?: Position
    duration?: number
    type?: AlertProps["status"]
    message: ReactNode
}
