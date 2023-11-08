import { prisma } from "@/app/utils/prisma"

export async function GET(req: Request) {
    const data = await prisma.category.findMany()
    
    return new Response(JSON.stringify({ "data": data }), {
        status: 200,
    })
}

export async function POST(req: Request){
    type CartItem={
        id: string,
        qty: number
    }
    
    const json: CartItem[] = await req.json()

   const data = await prisma.product.findMany({
    where:{
      id:{
        in: json.map(c => c.id)
      }
    },
    select: {
        id: true,
      isActive: true,
      name: true,
      price: true,
      image1: true,
      availableStock: true
    }
  })
    
    return Response.json({ "data": data })
}