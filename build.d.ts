import type { ServerBuild } from "@remix-run/server-runtime"

export const mode: ServerBuild["mode"]
export const entry: ServerBuild["entry"]
export const routes: ServerBuild["routes"]
export const assets: ServerBuild["assets"]
export const publicPath: ServerBuild["publicPath"]
export const assetsBuildDirectory: ServerBuild["assetsBuildDirectory"]
export const future: ServerBuild["future"]
