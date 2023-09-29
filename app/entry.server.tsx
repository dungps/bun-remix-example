import type * as RemixServer from "@remix-run/server-runtime"
import * as RemixReact from "@remix-run/react"
import { renderToReadableStream } from "react-dom/server"
import isbot from "isbot"

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: RemixServer.EntryContext
) {
    const stream = await renderToReadableStream(
        <RemixReact.RemixServer context={remixContext} url={request.url} />
    )

    if (isbot(request)) {
        await stream.allReady
    }

    responseHeaders.set("Content-Type", "text/html")

    return new Response(stream, {
        status: responseStatusCode,
        headers: responseHeaders
    })
}
