import React from "react";
import { prisma } from "../utils/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Header from "../components/header";
import Link from "next/link";

async function Page() {
  const session: any = await getServerSession(authOptions as AuthOptions);
  const id = session ? session.id : ""
  const data = await prisma.favorite.findMany({
    include: {
      product: {
        select: {
          id: true,
          name: true,
          image1: true,
          averageRating: true,
          price: true,
        },
      },
    },
    where: { product: { isActive: true }, userId: id },
  });
  return (
    <div className="flex w-full flex-col">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <Header />
      </div>
      <div className="flex w-full flex-col space-y-4 items-start p-6 lg:px-16 mt-28">
      <div>
      <span className="text-xl font-bold">Your wishlist</span>
      </div>
        {data.length === 0 && (
          <div className="flex flex-col space-y-12 w-full h-full text-gray-500 text-2xl justify-center items-center">
            <img src="/empty.svg" className="w-36 h-36" />
            <span>Empty Favorite</span>
          </div>
        )}
        {data.length > 0 && (
          <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.map((item) => (
              <Link
                href={`/${item.product.id}`}
                key={item.product.id}
                className="p-2 flex flex-col h-full border-gray-400 border"
              >
                <img
                  src={item.product.image1}
                  className="w-full aspect-square"
                />
                <div className="w-full space-y-1 mt-2">
                  <span className="text-sm font-bold line-clamp-2">
                    {item.product.name}
                  </span>
                  {item.product.averageRating !== 0 && (
                    <span className="flex text-sm font-bold line-clamp-2 text-gray-500 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 mr-2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                      {item.product.averageRating}
                    </span>
                  )}
                </div>
                <span className="text-md text-orange-500 font-bold mt-3">
                  $ {item.product.price}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
