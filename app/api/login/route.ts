import { prisma } from '@/app/utils/prisma';
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

export async function POST(req: Request) {
    const { email, password, fcmtoken } = await req.json();
    const secret = process.env.NEXTAUTH_SECRET
    const expirationTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days

    if (email && password) {
        const user = await prisma.user.findUnique({ where: { email } })
        if (user && user.password) {
            if (user.password) {
                const match = bcrypt.compareSync(password, user.password);
                const newObject = Object.fromEntries( // remove password from response 
                    Object.entries(user).filter(([key]) => key !== 'password')
                  );
                if (match) {
                    const token = jwt.sign(newObject, secret, { expiresIn: expirationTime })
                    const data = {...newObject, accessToken: token, expiresIn: expirationTime, google: false}
                    await prisma.user.update({
                        where: {id: user.id}, data:{
                            fcmToken: fcmtoken
                        }
                    })
                    return Response.json({ "data": data })
                } else {
                    return new Response(JSON.stringify({ "error": "Wrong username / password" }), {
                        status: 401,
                    })
                }
            }
        }else{
            return new Response(JSON.stringify({ "error": "Wrong username / password" }), {
                status: 401,
            })
        }
    }else{
        return new Response(JSON.stringify({ "error": "Wrong username / password" }), {
            status: 401,
        })
    }
}