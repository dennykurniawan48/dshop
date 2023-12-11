import { NextRequest, NextResponse } from "next/server"
import { DataSession } from "./app/utils/type/session/DataSession";

async function middleware(req: NextRequest) {
    const cookie = req.headers.get("cookie") ?? null
    let data: DataSession = { user: null }
    await fetch(`https://dshop-alpha.vercel.app/api/session?cookie=${cookie}`).then(res => {
        if (res.ok) {
            return res.json()
        }
    }).then(res => {
        data = res.data
    }).catch(err => {
        console.log(err)
    })

    if (data && data.user) {
        if (req.nextUrl.pathname.includes("/admin") && req.nextUrl.pathname !== "/admin/login"
            && data.user.is_admin !== true) {
            return NextResponse.redirect(
                new URL("/admin/login", req.url)
            )
        } else {
            if ((req.nextUrl.pathname.startsWith("/order") || req.nextUrl.pathname.startsWith("/cart") || req.nextUrl.pathname.startsWith("/favorite")) && data.user.is_admin !== false) {
                return NextResponse.redirect(
                    new URL("/", req.url)
                )
            }
        }
    } else {
        if (req.nextUrl.pathname.includes("/admin") && req.nextUrl.pathname !== "/admin/login") {
            return NextResponse.redirect(
                new URL("/admin/login", req.url)
            )
        } else if(req.nextUrl.pathname !== "/admin/login") {
            return NextResponse.redirect(
                new URL("/", req.url)
            )
        }
    }
}

export default middleware
// // Applies next-auth only to matching routes - can be regex
// // Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    matcher: ["/order/:path", "/cart", "/favorite", '/admin/:path*'],
}