import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const data = await prisma.delivery.findMany({})
    return Response.json({"data": data})
}