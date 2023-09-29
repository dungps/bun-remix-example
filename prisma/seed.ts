import { db } from "~/server/db.server"
import { hashSync } from "bcryptjs"

db.user
    .upsert({
        where: { username: "admin@example.com" },
        update: {},
        create: {
            username: "admin@example.com",
            password: hashSync("admin1234"),
            display_name: "Admin"
        }
    })
    .then(async () => {
        await db.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await db.$disconnect()
        process.exit(1)
    })
