import type { User } from "@prisma/client"
import { db } from "~/server/db.server"

export const getById = async (id: number): Promise<User | null> => {
    const user = await db.user.findFirst({
        where: {
            id: id
        }
    })

    return user && user.id ? user : null
}

export const getByKey = async (key: string, value: any): Promise<User | null> => {
    return db.user.findFirst({
        where: {
            [key]: value
        }
    })
}
