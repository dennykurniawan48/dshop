import { prisma } from "@/app/utils/prisma"

export async function GET(req: Request) {
    const {pathname} = new URL(req.url)

    const arr = pathname.split('/')
    const id = arr[arr.length-1]

    const data = await prisma.$transaction([
        prisma.category.findUnique({where:{id:id}}),
        prisma.product.findMany({where:{categoryId:id, isActive: true}})
    ])

    const response = {category: data[0], products: data[1]}
    
    return new Response(JSON.stringify({ "data": response }), {
        status: 200,
    })
}