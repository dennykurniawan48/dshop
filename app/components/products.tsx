"use client";

import { Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";
import Productitem from "./productitem";
import { StatusLoading } from "../utils/enum/StatusLoading";
const poppins = Poppins({ weight: "600", subsets: ["latin"] });

type PaginateResult = {
  data: {
    total: number;
    products: [
      {
        id: string;
        name: string;
        categoryId: string;
        image1: string;
        price: number;
        averageRating: number;
      }
    ];
    currentPage: number;
    totalPage: number;
  };
};

function Products(params: {cat: string | string[] | null}) {
  const [data, setData] = useState<PaginateResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerpage, setLimitPerpage] = useState(18);
  const [statusLoading, setStatusLoading] = useState(StatusLoading.Idle);

  useEffect(() => {
    setStatusLoading(StatusLoading.Loading);
    let url = `/api/productbycategory?page=${currentPage}&limit=${limitPerpage}`
    if(params.cat){
      url=url.concat(`&cat=${params.cat}`)
    }
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        setData(res);
        setStatusLoading(StatusLoading.Success);
      })
      .catch((err) => console.log(err));
  }, [currentPage, params.cat]);

  return (
    <div className="w-full flex flex-col space-y-4 pb-4">
      <span className={`${poppins.className} text-lg `}>Newest Products</span>
      <div className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {statusLoading === StatusLoading.Loading && (
          <>
            {[...new Array(12)].map((item) => (
              <div className="w-full aspect-square bg-slate-300" key={item}></div>
            ))}
          </>
        )}
        {data && data.data.products.map((item) => <Productitem key={item.id} data={item} />)}
      </div>
      {data && (
        <div className="w-full">
          <div className="mt-8 flex justify-between">
            <button
              className={`${
                data.data.currentPage > 1 ? "bg-purple-400" : "bg-gray-400"
              } px-4 py-2 text-white`}
              onClick={() => {
                if (data.data.currentPage > 1) {
                  setCurrentPage((prev) => prev - 1);
                }
              }}
            >
              &lt;&lt; Prev
            </button>
            <button
              className={`${
                data.data.currentPage < data.data.totalPage
                  ? "bg-purple-400"
                  : "bg-gray-400"
              } px-4 py-2 text-white`}
              onClick={() => {
                if (data.data.currentPage < data.data.totalPage) {
                  setCurrentPage((prev) => prev + 1);
                }
              }}
            >
              Next &gt;&gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
