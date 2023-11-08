import { prisma } from "@/app/utils/prisma"

export async function GET(req: Request) {
    const data = await prisma.slider.findMany()
    
    return Response.json({ "data": data  })
}