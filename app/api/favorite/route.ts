import { prisma } from '@/app/utils/prisma'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import * as Yup from 'yup'
const jwt = require('jsonwebtoken')

export async function POST(req: Request) {
    const favSchema = Yup.object({
        productId: Yup.string().required()
    })

    const { productId } = await favSchema.validate(await req.json())
    const token = await getToken({ req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if (user) {
        const fav = await prisma.favorite.create({
            data: {
                productId,
                userId: user.id
            }
        })

        return Response.json({ data: fav })
    } else {
        return new Response(JSON.stringify({ "error": "not authenticated" }), {
            status: 401,
        })
    }

}

export async function GET(req: Request) {
    const token = await getToken({ req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)

    const data = await prisma.favorite.findMany({
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    image1: true,
                    averageRating: true,
                    price: true,
                },
            },
        },
        where: { product: { isActive: true }, userId: user.id },
    });

    return Response.json({ data: data })
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') ?? ""

    const token = await getToken({ req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if (user) {
        const data = await prisma.favorite.deleteMany({
            where: {
                productId: id,
                userId: user.id
            }
        })
        return Response.json({ data: data })
    } else {
        return new Response(JSON.stringify({ "error": "not authenticated" }), {
            status: 401,
        })
    }
}