import { getSession } from "next-auth/react"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        const requestForNextAuth = {
            headers: {
                cookie: searchParams.get("cookie") ?? undefined,
            },
        }

        const data = await getSession({ req: requestForNextAuth })

        return Response.json({ data })
    } catch (err) {
        return Response.json({ data: null })
    }

}