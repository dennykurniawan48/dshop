import { prisma } from "@/app/utils/prisma";

export async function GET(req: Request){
    const data = await prisma.country.findMany({
        include:{
            state: true
        }
    })

    return Response.json({"data":data})
}