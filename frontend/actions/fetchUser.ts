"use server"
import { auth } from "@/server/auth"
import { db } from "@/server/db"
export async function FetchUser() {
    const session = await auth()
    if (!session) {
        return null
    }
    const user = await db.user.findUnique({
        where: { id: session.user.id, },
        select: {
            name: true,
            email: true,
            image: true,
            nickname: true,
            about: true,
            whatDoYouDo: true,
            customTraits: true,
            subscription: {
                select: {
                    plan: true,
                }
            }
        }
    })

    return user
}