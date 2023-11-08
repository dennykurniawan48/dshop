import { prisma } from "@/app/utils/prisma"

export async function GET(req: Request){
    const url = new URL(req.url)
    const pathname = url.pathname.split('/')
    const id = pathname[pathname.length - 1]

    const data = await prisma.order.findFirst({
        where: { id }, include: {detailorder: {include:{products:{select:{name:true, image1: true}}}}, status:true, state:{
            include:{country:true}
        }, delivery: true}
    })

    return Response.json({data:data})
}