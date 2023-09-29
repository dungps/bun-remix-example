export interface MiddlewareArgs {
    request: Request
    resolve: (request: Request) => Promise<Response> | Response
}

export type Middleware = (args: MiddlewareArgs) => Promise<Response> | Response

export const middleware: Middleware = async ({ request, resolve }: MiddlewareArgs) => {
    return resolve(request)
}
