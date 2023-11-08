import React, { useState } from "react";
import ImageProduct from "../components/detail-products/imageproduct";
import { Poppins } from "next/font/google";
import Header from "../components/header";
import { prisma } from "../utils/prisma";
import DetailReview from "../components/detail-products/detailreview";
import Addcart from "../components/detail-products/addcart";
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const poppins600 = Poppins({ weight: "600", subsets: ["latin"] });
const poppins800 = Poppins({ weight: "800", subsets: ["latin"] });

async function Page(props: { params: { product: string } }) {

  const data = await prisma.product.findUnique({
    where: { id: props.params.product },
  });

  return (
    <div className="w-full flex flex-col">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <Header />
      </div>
      <div className={`w-full flex items-center mt-24 px-6 lg:px-12 py-6`}>
        <div className="flex flex-col lg:px-12 w-full">
          <div className="flex flex-col lg:flex-row space-y-8 lg:flex-y-0 lg:space-x-12 w-full">
            <div className="flex w-full lg:w-2/6">
              <ImageProduct data={[data?.image1, data?.image2, data?.image3, data?.image4]} />
            </div>
            <div className={`${poppins600.className} flex w-full lg:w-4/6 flex-col`}>
              <span className="text-2xl">{data?.name}</span>
              {data?.averageRating !== 0 &&  <div className="flex items-center">
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
                </svg>{" "}
                <span>{Math.round((data?.averageRating ?? 0) *10)/10}</span>
              </div>}
              <Addcart price={data?.price!} availableStock={data?.availableStock!} id={data?.id!}/>
              <DetailReview data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
