import { prisma } from "@/app/utils/prisma"
import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
const jwt = require("jsonwebtoken")
import * as Yup from 'yup'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 10)

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)

    if (user) {
        const data = await prisma.$transaction([
            prisma.order.count(
                {
                    where: { userId: user.id },
                }
            ),
            prisma.order.findMany({
                where: { userId: user.id }, include: {
                    detailorder: {
                        select: {
                            price: true,
                            qty: true,
                            products: { select: { image1: true, name: true, categories: true } },
                        },
                    },
                    status: true,
                }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }
            })
        ])
        const response = { total: data[0], order: data[1], currentPage: page, totalPage: Math.ceil(data[0] / limit) }
        return Response.json({ "data": response })
    } else {
        return new Response(JSON.stringify({ "error": "Not authenticated" }), {
            status: 401,
        })
    }
}

export async function POST(req: NextRequest) {
    type DetailCart = {
        productId: string,
        price: number,
        qty: number
    }

    const secrets = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req, secret: secrets, raw: true })
    const checkoutSchema = Yup.object({
        stateId: Yup.string().required('required'),
        shippingMethodId: Yup.string().required('required'),
        discount: Yup.number().required('required'),
        deliveryCost: Yup.number().required('required'),
        total: Yup.number().required('required'),
        coupon: Yup.string(),
        details: Yup.array(
            Yup.object({
                productId: Yup.string().required(),
                // price: Yup.number().required(),
                qty: Yup.number().required(),
                // productName: Yup.string().required(),
                // image: Yup.string().required(),
            })
        ),
        zipCode: Yup.string().required('required'),
        address: Yup.string().required('required'),
    })

    const data = await checkoutSchema.validate(await req.json())
    const filteredReqProductId = data.details?.map((item) => item.productId)

    const user = jwt.verify(token, secrets)

    const orderedProduct = await prisma.product.findMany({
        where: {
            id: {
                in: filteredReqProductId
            }
        }
    })

    const productWithQty = orderedProduct.map(item => {
        const selected = data.details?.find(product => product.productId == item.id)
        return {
            id: item.id,
            price: item.price,
            qty: selected?.qty ?? 0
        }
    })

    if (user) {
        const detail: DetailCart[] = []
        for (let item of productWithQty ?? []) {
            detail.push({ productId: item.id, price: item.price, qty: item.qty })
        }
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                deliveryId: data.shippingMethodId,
                deliveryCost: data.deliveryCost,
                discount: data.discount,
                detailorder: {
                    create: detail
                },
                stateId: data.stateId,
                paid: false,
                fullName: user.name,
                total: data.total,
                zipCode: data.zipCode,
                address: data.address,
                couponCode: data.coupon
            }
        })
        return Response.json({ "data": order })
    } else {
        return new Response(JSON.stringify({ "error": "not authenticated" }), {
            status: 401,
        })
    }
}