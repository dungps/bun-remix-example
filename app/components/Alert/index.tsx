import { memo, type PropsWithChildren } from "react"

export interface AlertProps {
    status?: "success" | "info" | "warning" | "danger" | "basic"
}

const Alert = memo<PropsWithChildren<AlertProps>>(({ status = "basic", children }) => {
    switch (status) {
        default:
        case "basic":
            return <div className="alert text-gray-900 bg-gray-100 mb-2">{children}</div>
        case "info":
            return <div className="alert bg-primary-light text-primary mb-2">{children}</div>
        case "success":
            return <div className="alert text-green-800 bg-green-100 mb-2">{children}</div>
        case "warning":
            return <div className="alert text-yellow-800 bg-yellow-100 mb-2">{children}</div>
        case "danger":
            return <div className="alert text-red-700 bg-red-100 mb-2">{children}</div>
    }
})

Alert.displayName = "Alert"

export default Alert
