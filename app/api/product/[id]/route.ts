import { prisma } from "@/app/utils/prisma"
import { data } from "autoprefixer"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const pathname = url.pathname.split('/')
    const id = pathname[pathname.length - 1]

    const data = await prisma.product.findUnique({
        where: { id }
        // , include: {
        //     reviews: {
        //         select: {
        //             comment: true,
        //             rating: true,
        //             user: {
        //                 select: {
        //                     name: true,
        //                     image: true
        //                 },
        //             }
        //         }, take: 10, orderBy: {rating: 'desc'}
        //     }
        // }
    })

    if (!data) {
        return new Response(JSON.stringify({ "error": "Product not found" }), {
            status: 404,
        })
    }

    return Response.json({ "data": data })
}