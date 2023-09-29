export type Handler = (request: Request) => Promise<Response> | Response

export interface Handlers {
    ALL?: Handler
    GET?: Handler
    POST?: Handler
    DELETE?: Handler
    PUT?: Handler
    PATCH?: Handler
    HEAD?: Handler
    OPTIONS?: Handler
}
