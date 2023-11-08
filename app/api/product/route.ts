import { prisma } from "@/app/utils/prisma"
import productSchema from "@/app/utils/schema/product/product"
import { NextResponse } from "next/server"
import * as Yup from 'yup'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') ?? 1)
    const limit = Number(searchParams.get('limit') ?? 10)
    const onlyActive: boolean = Boolean(searchParams.get('active') ?? true)
    const query = searchParams.get('query') ?? ""

    if (query.length > 0) {
        const data = await prisma.$transaction([
            prisma.product.count({ where: onlyActive ? { isActive: true, name: { search: query }} : { name: { search: query } } }),
            prisma.product.findMany({ where:  onlyActive ? { isActive: true, name: { search: query }} : { name: { search: query } }, skip: (page - 1) * limit })
        ])
        const response = { total: data[0], products: data[1], currentPage: page, totalPage: Math.ceil(data[0] / limit) }
        return Response.json({ "data": response })
    } else {
        const data = await prisma.$transaction([
            prisma.product.count({ where: { isActive: true } }),
            prisma.product.findMany({ where: { isActive: true }, skip: (page - 1) * limit })
        ])
        const response = { total: data[0], products: data[1], currentPage: page, totalPage: Math.ceil(data[0] / limit) }
        return Response.json({ "data": response })
    }
}


export async function POST(req: Request) {
    try {
        const data = await productSchema.validate(await req.json())
        const newProduct = await prisma.product.create({
            data: {
                name: data.productname,
                categoryId: data.category,
                image1: data.image1,
                image2: data.image2,
                image3: data.image3,
                image4: data.image4,
                desc: data.desc,
                price: data.price,
                isActive: data.stock > 0,
                availableStock: data.stock
            }
        })
        return NextResponse.json({ data: newProduct })
    } catch (e) {
        return new Response(JSON.stringify({ "error": "Validation error" }), {
            status: 405,
        })
    }
}

export async function PUT(req: Request) {
    const putProductSchema = productSchema.shape({
        id: Yup.string().required()
    })

    try {
        const data = await putProductSchema.validate(await req.json())
        const product = await prisma.product.update({
            where: {
                id: data.id
            }, data: {
                name: data.productname,
                image1: data.image1,
                image2:data.image2,
                image3:data.image3,
                image4:data.image4,
                desc: data.desc,
                price: data.price,
                availableStock: data.stock,
                categoryId: data.category
            }
        })

        return NextResponse.json({ data: product })

    } catch (e) {
        console.log(e)
        return new Response(JSON.stringify({ "error": "Validation error" }), {
            status: 405,
        })
    }
}