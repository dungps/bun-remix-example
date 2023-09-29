import { memo, type PropsWithChildren } from "react"
import type { Position } from "~/components/Toast/types"

interface Props {
    position?: Position
}

const Toast = memo<PropsWithChildren<Props>>(({ children, position = "top-right" }) => {
    switch (position) {
        default:
        case "top-right":
            return (
                <div className="fixed toast top-5 right-5 w-[100vw] sm:w-[320px]">
                    {children}
                </div>
            )
        case "top-left":
            return (
                <div className="fixed toast top-5 left-5 w-[100vw] sm:w-[320px]">
                    {children}
                </div>
            )
        case "top-center":
            return (
                <div className="fixed toast top-5 left-[50%] w-[100vw] sm:w-[320px] -translate-x-[50%]">
                    {children}
                </div>
            )
        case "bottom-center":
            return (
                <div className="fixed toast bottom-5 left-[50%] w-[100vw] sm:w-[320px] -translate-x-[50%]">
                    {children}
                </div>
            )
        case "bottom-right":
            return (
                <div className="fixed toast bottom-5 right-5 w-[100vw] sm:w-[320px]">
                    {children}
                </div>
            )
        case "bottom-left":
            return (
                <div className="fixed toast bottom-5 left-5 w-[100vw] sm:w-[320px]">
                    {children}
                </div>
            )
    }
})

Toast.displayName = "Toast"

export default Toast
