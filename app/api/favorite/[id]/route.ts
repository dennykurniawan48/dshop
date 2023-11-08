import { prisma } from "@/app/utils/prisma"
import { data } from "autoprefixer"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"
const jwt = require('jsonwebtoken')

export async function GET(req: Request){
    const url = new URL(req.url)
    const pathname = url.pathname.split('/')
    const id = pathname[pathname.length - 1]

    const token = await getToken({req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET, raw:true})
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    if(user){
        const fav = await prisma.favorite.count({ where: { productId:id , userId: user.id } })
       return NextResponse.json({data:{isExist: fav > 0}})
    }else{
        return new Response(JSON.stringify({"error": "not authenticated"}), {status: 401})
    }
}