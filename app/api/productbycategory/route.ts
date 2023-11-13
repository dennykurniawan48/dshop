import { prisma } from "@/app/utils/prisma"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 10)
    const category = searchParams.get('cat') ?? ""

    if (category.length == 0) {
        const data = await prisma.$transaction([
            prisma.product.count({ where: { isActive: true } }),
            prisma.product.findMany({ select: { id: true, name: true, categoryId: true, image1: true, price: true, averageRating: true }, where: { isActive: true }, skip: (page - 1) * limit, take:limit })
        ])
        const response = { total: data[0], products: data[1], currentPage: page, totalPage: Math.ceil(data[0] / limit) }
        return Response.json({ "data": response })
    } else {
        const data = await prisma.$transaction([
            prisma.product.count({ where: { isActive: true, categoryId: category } }),
            prisma.product.findMany({ select: { id: true, name: true, categoryId: true, image1: true, price: true, averageRating: true }, where: { isActive: true, categoryId: category }, skip: (page - 1) * limit, take:limit})
        ])
        const response = { total: data[0], products: data[1], currentPage: page, totalPage: Math.ceil(data[0] / limit) }
        return Response.json({ "data": response })
    }
}