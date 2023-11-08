import { prisma } from "@/app/utils/prisma"

export async function GET(req: Request) {
    const topIdProduct = await prisma.detailOrder.groupBy({
        by: ['productId'],
        _sum: {
            qty: true
        },
        where: {
            order: {
                paid: true
            }
        },
        orderBy: {
            _sum: {
                qty: "desc"
            }
        },
        take: 5,
    })

    const product = await prisma.product.findMany({
        where: {
            id: {
                in: topIdProduct.map(item => item.productId)
            }
        }, select: {
            id: true,
            name: true
        }
    })

    const topIdUser = await prisma.order.groupBy({
        by: ['userId'],
        _count: {
            id: true
        },
        where: {
            paid: true
        },
        orderBy: {
            _count: {
                id: "desc"
            }
        },
        take: 5,
    })

    const user = await prisma.user.findMany({
        where: {
            id: {
                in: topIdUser.map(it => it.userId)
            }
        }, select: {
            id: true, name: true
        }
    })

    const topProduct = product.map(item => {
        const qty = topIdProduct.find(it => it.productId === item.id)
        return { name: item.name, qty: qty?._sum.qty ?? 0 }
    })

    const topUser = user.map(item => {
        const qty = topIdUser.find(it => it.userId === item.id)
        return { name: item.name, qty: qty?._count.id ?? 0 }
    })



    return Response.json({ data: { product: topProduct, user: topUser } })
}