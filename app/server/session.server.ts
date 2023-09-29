import { getByKey } from "~/server/user.server"
import { compareSync, hashSync } from "bcryptjs"
import { createCookieSessionStorage, redirect } from "@remix-run/node"

export interface LoginForm {
    username: string
    password: string
}

type SessionData<T> = T & {
    user_id: string | number
    workspace_id: string
}

export const login = async ({ username, password }: LoginForm) => {
    const user = await getByKey("username", username)
    if (!user) {
        throw Error(`User ${username} not found`)
    }

    if (!compareSync(password, user.password)) {
        throw Error(`Password not match`)
    }

    return { id: user.id, username }
}

const sessionSecret = Bun.env.SESSION_SECRET || "this is a sample secret"

const storage = createCookieSessionStorage({
    cookie: {
        name: "nhe-session",
        secure: Bun.env.NODE_ENV === "production",
        secrets: [sessionSecret],
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true
    }
})

function getSession(request: Request) {
    return storage.getSession(request?.headers?.get("Cookie"))
}

export async function createUserSession(
    request: Request,
    props: SessionData<any>,
    redirectTo: string = "/"
) {
    const session = await getSession(request)
    for (const key of Object.keys(props)) {
        session.set(key, props[key])
    }
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session)
        }
    })
}

export const destroyUserSession = async (request: Request, redirectTo: string = "/") => {
    const session = await getSession(request)
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.destroySession(session)
        }
    })
}

export const getSessionByKey = async (request: Request, key: string): Promise<any> => {
    const session = await getSession(request)
    const id = session.get(key)
    if (!id) {
        return null
    }

    return id
}

export const getUserId = async (request: Request): Promise<number | null> => {
    const id = await getSessionByKey(request, "user_id")
    return parseInt(id + "", 10)
}
