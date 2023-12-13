import { prisma } from "@/app/utils/prisma";
import { GoogleLogin } from "@/app/utils/type/GoogleResult";
import verifyGoogleToken from "@/app/utils/verifyGoogleToken";
import { randomUUID } from "crypto";
const jwt = require('jsonwebtoken')

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token') ?? ""
    const fcmToken = searchParams.get('fcmtoken') ?? null
    const expirationTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days

    if (token) {
        const result: GoogleLogin = await verifyGoogleToken(token);
        if (result.success) {
            const exist = await prisma.user.findUnique({
                where: {
                    email: result.data?.email
                }
            });
            if (!exist) {
                const user = await prisma.user.create({
                    data: {
                        email: result.data?.email,
                        password: null,
                        name: result.data?.name,
                        accounts: {
                            create: {
                                type: "oauth",
                                provider: "google",
                                providerAccountId: result.data?.sub ?? randomUUID()
                            }
                        }
                    }
                });
                if (user) {
                    const { password, ...rest } = user
                    const token = jwt.sign(rest, process.env.NEXTAUTH_SECRET, { expiresIn: expirationTime })
                    const data = { ...rest, accessToken: token, expiresIn: expirationTime, google: true }

                    await updateFcm(result.data?.email as string, fcmToken)
                    return Response.json({ data: data });
                } else {
                    return new Response(JSON.stringify({ "error": "Something went wrong." }), {
                        status: 500,
                    })
                }
            } else {
                const { password, ...rest } = exist
                const token = jwt.sign(rest, process.env.NEXTAUTH_SECRET, { expiresIn: expirationTime })
                const data = { ...rest, accessToken: token, expiresIn: expirationTime, google: true }

                await updateFcm(result.data?.email as string, fcmToken)
                return Response.json({ data: data });
            }
        } else {
            return new Response(JSON.stringify({ "error": "Something went wrong." }), {
                status: 500,
            })
        }
    } else {
        return new Response(JSON.stringify({ "error": "Wrong credentials." }), {
            status: 401,
        })
    }
}

async function updateFcm(email: string, fcmToken: string | null) {
    await prisma.user.update({
        where: {
            email
        }, data: {
            fcmToken
        }
    })
}