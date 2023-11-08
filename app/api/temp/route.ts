import { prisma } from "@/app/utils/prisma"
import { data } from "autoprefixer"
import { randomUUID } from "crypto"
const bcrypt = require("bcryptjs")

export async function GET(req: Request) {
    // const data = await prisma.favorite.findMany({
    //     include: {
    //       product: {
    //         select: { name: true, image1: true, averageRating: true, price: true },
    //       },
    //     }
    //   });
        
  //   const data = await prisma.review.aggregate({
  //     _avg: {
  //       rating: true,
  //     },
  //     where: {
  //       productId: 'clmlhj6tg000gej2x0wt1vz3q',
  //     },
  // })

  // const review = await prisma.review.groupBy({
  //   by: ['rating'],
  //   where: {productId: 'clmlhj6tg000gej2x0wt1vz3q'},
  //   _count: {
  //     rating: true,
  //   },
  //   orderBy:{rating: 'asc'}
  // })

  // const data: {rating: number, count: number}[] = []

  // for(let i = 1; i<=5; i++){
  //   const exist = review.find(item => item.rating === i)
  //   data.push(exist ? {rating: exist.rating, count: exist._count.rating}: {rating: i, count: 0})
  // }

    // const data = await prisma.order.updateMany({
    //     data:{
    //         statusId: "done"
    //     },where:{paid:true}
    // })

    // const data = await prisma.statusPayment.createMany( {data:[
    //     {status_name: "All", id: "all"},
    //     {status_name: "Waiting payment", id: "payment"},
    //     {status_name: "In delivery", id: "delivery"},
    //     {status_name: "Done", id: "done"}
    //   ], skipDuplicates: true})

    //const data = await prisma.order.findUnique({where: {id: "clndlkt0u0005ejpv5smhq5da"}})

    // const user = await prisma.user.create({
    //     data: {
    //       email: "admin",
    //       password: bcrypt.hashSync("admin123", 8),
    //       name: "admin",
    //       isAdmin: true,
    //       accounts: {
    //         create: {
    //           type: "credentials",
    //           provider: "credentials",
    //           providerAccountId: randomUUID()
    //         }
    //       }
    //     }
    //   })
    // const data = await prisma.user.delete({
    //     where:{
    //         id:'clnif9xph0000ejw7t62gxcrh'
    //     }
    // })

    const data = await prisma.user.findFirst({
        where:{
            id: "clmis2v8m000gejezlu7ajwu0"
        }
    })

    // const data = await prisma.user.findMany({})
    return new Response(JSON.stringify({ "data": data }), {
        status: 200,
    })
}