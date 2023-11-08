import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server"

// export default withAuth(
// `withAuth` augments your `Request` with the user's token.
async function middleware(request: NextRequest) {
    const requestForNextAuth = {
        headers: {
            cookie: request.headers.get("cookie"),
        },
    };

    const session = await getSession({ req: requestForNextAuth });

    //         console.log(request.nextUrl.pathname)
    //         console.log(request.nextauth.token)

    if (request.nextUrl.pathname.includes("/admin") && request.nextUrl.pathname !== "/admin/login"
        && (!session && session?.is_admin !== true)) {
        return NextResponse.redirect(
            new URL("/admin/login", request.url)
        )
    }

    if ((request.nextUrl.pathname.startsWith("/order") || request.nextUrl.pathname.startsWith("/cart") || request.nextUrl.pathname.startsWith("/favorite")) && (!session && session?.is_admin !== false)) {
        return NextResponse.redirect(
            new URL("/", request.url)
        )
    }
}

export default middleware
// Applies next-auth only to matching routes - can be regex
// Ref: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    matcher: ["/order/:path", "/cart", "/favorite", '/admin/:path*']
}