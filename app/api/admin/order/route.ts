import { prisma } from "@/app/utils/prisma";

export async function GET(req: Request){
    const { searchParams } = new URL(req.url)
    const start = searchParams.get('start') ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const end = searchParams.get('end') ?? new Date(new Date().getFullYear(), new Date().getMonth()+1, 0)
    const data = await prisma.order.findMany({
        where:{
            createdAt:{
                gte: `${new Date(start).toISOString()}`,
                lte: `${new Date(new Date(end).setHours(23, 59, 59)).toISOString()}`
            }
        },
        include:{
            status:true
        }, orderBy:{
          createdAt: "desc"
        }, take: 30
      });

    return Response.json({data: data})
}