import path from "node:path"
import * as fs from "node:fs"

import sourceMapSupport from "source-map-support"
import { createRequestHandler, logDevReady } from "@remix-run/server-runtime"
import { connect } from "ngrok"
import * as build from "./build"
import { FileSystemRouter } from "bun"
import { Handlers, Handler } from "./types"
import { middleware } from "~/middleware"
import * as url from "url"

sourceMapSupport.install()

const BUILD_PATH = "./build/index.js"

const mode = Bun.env.NODE_ENV === "production" ? "production" : "development"

if (mode === "development") logDevReady(build)

let requestHandler = createRequestHandler(build, mode)

const handleAPI = async (apiPath: string, request: Request): Promise<Response | undefined> => {
    const { pathname } = new URL(request.url)

    if (pathname.startsWith("/api")) {
        const router = new FileSystemRouter({
            dir: path.resolve(__dirname, apiPath),
            style: "nextjs"
        })

        const route = router.match(pathname.replace("/api", ""))
        if (route) {
            // @ts-expect-error
            const handle: Handlers = await import(route.filePath)
            let h: Handler | undefined
            if (handle.ALL) {
                h = handle.ALL
            } else if (handle[request.method as keyof Handlers]) {
                h = handle[request.method as keyof Handlers] as Handler
            }

            if (h) h(request)
        }
    }

    return undefined
}

const serveStatic = (staticDir: string, request: Request): Response | undefined => {
    const { pathname } = new URL(request.url)

    if (pathname.length < 2) return undefined

    const filePath = path.join(staticDir, pathname)

    if (fs.existsSync(filePath)) {
        const file = Bun.file(filePath)
        return new Response(file, {
            headers: {
                "Content-Type": file.type,
                "Cache-Control": "public, max-age=31536000"
            }
        })
    }

    return undefined
}

async function handler(request: Request): Promise<Response> {
    const file = serveStatic("public", request)
    if (file) return file

    const apiResponse = await handleAPI("./app/api", request)
    if (apiResponse) return apiResponse

    if (mode === "development") {
        const stat = fs.statSync(BUILD_PATH)
        // @ts-expect-error
        const newBuild = await import(BUILD_PATH + "?t=" + stat.mtimeMs)
        requestHandler = createRequestHandler(newBuild, mode)
    }

    return requestHandler(request)
}

const server = Bun.serve({
    hostname: "0.0.0.0",
    port: Bun.env.PORT ?? 1102,
    fetch: async (request: Request) => {
        return middleware({
            request,
            resolve: handler
        })
    }
})

console.log(`Server started at ${server.hostname}:${server.port}`)

if (Bun.env.NGROK_AUTH_TOKEN) {
    connect({
        proto: "http",
        addr: server.port,
        authtoken: Bun.env.NGROK_AUTH_TOKEN,
        domain: Bun.env.NGROK_DOMAIN ?? undefined
    }).then((url) => console.log(`Ngrok URL: ${url}`))
}
