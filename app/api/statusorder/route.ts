import { prisma } from "@/app/utils/prisma";

export async function GET(req: Request){
    const data = await prisma.statusPayment.findMany()
    return Response.json({data: data})
}