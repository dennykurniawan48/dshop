import { getToken } from "next-auth/jwt"
import { NextRequest } from "next/server"
const jwt = require('jsonwebtoken')

export async function GET(req: Request){
    const token = await getToken({ req: req as NextRequest, secret: process.env.NEXTAUTH_SECRET, raw: true })
    const user = jwt.verify(token, process.env.NEXTAUTH_SECRET)
    return Response.json({data: user})
}