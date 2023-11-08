import { prisma } from "@/app/utils/prisma"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
const jwt = require("jsonwebtoken")
import * as Yup from 'yup'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const groupReview = await prisma.review.groupBy({
        by: ['rating'],
        where: { productId: searchParams.get('productId') ?? "" },
        _count: {
            rating: true,
        },
        orderBy: { rating: 'asc' }
    })

    const total = await prisma.review.count({
        where: {
            productId: searchParams.get("productId") ?? ""
        }
    })

    const review = await prisma.review.findMany({
        where: {
            productId: searchParams.get("productId") ?? ""
        }, select: {
            comment: true,
            rating: true,
            user: {
                select: {
                    name: true,
                    image: true
                }
            }
        }, take: Number(searchParams.get('limit') ?? 5), orderBy: { createdAt: 'desc' }
    })

    const star: { rating: number, count: number }[] = []

    for (let i = 1; i <= 5; i++) {
        const exist = groupReview.find(item => item.rating === i)
        star.push(exist ? { rating: exist.rating, count: exist._count.rating } : { rating: i, count: 0 })
    }

    return Response.json({ data: { review: review, star: star, total } })
}

export async function POST(req: Request) {
    const ratingSchema = Yup.object({
        detailOrderId: Yup.string().required("required"),
        comment: Yup.string().required('required'),
        rating: Yup.number().min(1).max(5).required('required')
    })
    const { comment, rating, detailOrderId } = await ratingSchema.validate(await req.json())
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req: req as NextRequest, secret: secret, raw: true })
    const user = jwt.verify(token, secret)
    if (user) {
        const detail = await prisma.detailOrder.update({ where: { id: detailOrderId }, data: { addReview: true } })
        const newReview = await prisma.review.create({
            data: {
                comment,
                userId: user.id,
                productId: detail.productId,
                rating
            }
        })

        const avg = await prisma.review.aggregate({
            _avg: {
                rating: true,
            },
            where: {
                productId: detail.productId,
            },
        })

        await prisma.product.update({
            where: {
                id: detail.productId
            }, data: {
                averageRating: avg._avg.rating ?? 0
            }
        })

        return Response.json(newReview)
    }
    return new Response(JSON.stringify({ "error": "not authenticated" }), {
        status: 401,
    })
}