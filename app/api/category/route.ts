import { prisma } from "@/app/utils/prisma"
import { categorySchema } from "@/app/utils/schema/category/category"
import * as Yup from 'yup'

export async function GET(req: Request) {
    const data = await prisma.category.findMany()
    
    return Response.json({ "data": data })
}

export async function POST(req: Request){
    try{
        const data = await categorySchema.validate(await req.json())
        const category = await prisma.category.create({
            data:{
                name: data.name,
                thumbnail: data.thumbnail
            }
        })

        return Response.json({data: category})
    }catch(e){
        return new Response(JSON.stringify({ "error": "Validation error" }), {
            status: 405,
        })
    }
}

export async function PUT(req: Request){
    try{
        const newCategorySchema = categorySchema.shape({
            id: Yup.string().required()
        })
        const data = await newCategorySchema.validate(await req.json())
        const updated = await prisma.category.update({
            where: {
                id: data.id
            }, data:{
                name: data.name,
                thumbnail: data.thumbnail
            }
        })

        return Response.json({data: updated})
    }catch(e){
        return new Response(JSON.stringify({ "error": "Validation error" }), {
            status: 405,
        })       
    }
}