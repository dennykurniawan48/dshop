import { prisma } from "@/app/utils/prisma";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
const jwt = require("jsonwebtoken")

export async function GET(req: NextApiRequest){
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)

    await prisma.user.update({
        where:{
            id: user.id
        }, data:{
            fcmToken: null
        }
    })

    return Response.json({data: {status: "success"}})
}