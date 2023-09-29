import type { LinksFunction } from "@remix-run/node"
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useFetcher,
    useNavigation,
    MetaFunction
} from "@remix-run/react"

import stylesheet from "~/assets/tailwind.css"
import nProgressCss from "nprogress/nprogress.css"
import nProgress from "nprogress"
import { ToastContainer } from "~/components/Toast"
import { useEffect, useMemo } from "react"

export const links: LinksFunction = () => [
    ...(stylesheet ? [{ rel: "stylesheet", href: stylesheet }] : []),
    ...(nProgressCss ? [{ rel: "stylesheet", href: nProgressCss }] : [])
]

export const meta: MetaFunction = () => {
    return [{ title: "Hello world" }]
}

export default function App() {
    const navigation = useNavigation()
    const fetchers = useFetcher()

    const state = useMemo<"idle" | "loading">(
        function getGlobalState() {
            let states = [navigation.state, fetchers.state]
            if (states.every((state) => state === "idle")) return "idle"
            return "loading"
        },
        [navigation.state, fetchers]
    )

    useEffect(() => {
        if (state !== "idle") {
            nProgress.start()
        } else {
            nProgress.done()
        }
    }, [navigation.state])

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ToastContainer />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
