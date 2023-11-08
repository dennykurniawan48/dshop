"use client";

import React, { use, useEffect, useState } from "react";
import Header from "../components/header";
import Link from "next/link";
import { StatusLoading } from "../utils/enum/StatusLoading";
import LoadOrder from "./loadOrder";
import LoadCategories from "./loadCategories";

async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [data, setData] = useState<ListHistory | null>(null);
  const [status, setStatus] = useState<StatusOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const [statusLoadListOrder, setStatusLoadListOrder] = useState(
    StatusLoading.Idle
  );
  const [statusLoadStatusOrder, setStatusLoadStatusOrder] = useState(
    StatusLoading.Idle
  );

  useEffect(() => {
    setStatusLoadListOrder(StatusLoading.Loading);
    fetch(`/api/order?page=${currentPage}&limit=${perPage}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        setData(res);
        setStatusLoadListOrder(StatusLoading.Success);
      })
      .catch((err) => console.log(err));
  }, [currentPage]);

  useEffect(() => {
    setStatusLoadStatusOrder(StatusLoading.Loading);
    fetch("/api/statusorder")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        setStatus(res);
        setStatusLoadStatusOrder(StatusLoading.Success);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <Header />
      </div>
      <div className="w-full flex flex-col md:flex-row mt-24 px-6 lg:px-24">
        <div className="w-full md:w-1/5 flex flex-col space-y-4">
          <span className="text-md font-bold">Status Order</span>
          {statusLoadStatusOrder == StatusLoading.Loading && <LoadCategories />}
          {statusLoadStatusOrder == StatusLoading.Success && (
            <div className="flex flex-col space-y-3 text-sm text-gray-500">
              {status &&
                status.data.map((item) => {
                  return (
                    <Link
                      key={item.id}
                      href={`${
                        item.id === "all" ? "order" : "order?status=" + item.id
                      } `}
                    >
                      {item.status_name}
                    </Link>
                  );
                })}
            </div>
          )}
        </div>
        {statusLoadListOrder == StatusLoading.Loading && <LoadOrder />}
        {statusLoadListOrder == StatusLoading.Success && (
          <div
            className={`w-full md:w-4/5 flex flex-col space-y-4 items-center`}
          >
            <div className="w-full flex justify-start">
              <span className="text-xl font-bold">Order list</span>
            </div>
            {data && data.data.order.length === 0 && (
              <div className="flex w-full h-[400px] justify-center items-center">
                <span>Empty data</span>
              </div>
            )}
            {data &&
              data.data.order.length > 0 &&
              data.data.order.map((item) => (
                <div
                  key={item.id}
                  className="w-full rounded-md px-6 py-1 flex flex-col space-y-4"
                >
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Order date: {item.createdAt.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-600 font-bold mr-4">
                      {item.status.status_name}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-3">
                    {item.detailorder.slice(0, 1).map((detail) => (
                      <div className="flex flex-col" key={detail.products.name}>
                        <div className="flex flex-row space-x-8">
                          <img
                            src={detail.products.image1}
                            className="w-12 h-12"
                            key={detail.products.name}
                          />
                          <div className="w-full flex flex-col space-y-1">
                            <div className="w-full flex justify-between">
                              <span className="text-xs text-gray-400">
                                {detail.products.categories.name}
                              </span>
                            </div>

                            <span>{detail.products.name}</span>
                            <span className="text-sm text-gray-500">
                              {detail.qty} X {detail.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {item.detailorder.length > 2 && (
                    <div className="flex flex-row justify-center">
                      <button>{item.detailorder.length - 2} more items</button>
                    </div>
                  )}
                  <div className="flex flex-row justify-end">
                    <Link
                      href={`order/${item.id}`}
                      className="rounded-md px-4 py-2 bg-purple-500 text-white text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            <div className="w-full flex">
              {data && (
                <div className="flex w-full justify-between my-8 text-white">
                  <button
                    className={`px-4 py-2 ${
                      data.data.currentPage == 1
                        ? "bg-gray-400"
                        : "bg-purple-400"
                    }`} onClick={() => {
                      if(currentPage > 1){
                      setCurrentPage(current => current-1)}
                    }}
                  >
                    &lt;&lt; Prev
                  </button>
                  <button className={`px-4 py-2 ${
                      data.data.currentPage == data.data.totalPage
                        ? "bg-gray-400"
                        : "bg-purple-400"
                    }`} onClick={() => {
                      if(data.data.currentPage < data.data.totalPage){
                        setCurrentPage(current => current+1)
                      }
                    }}>
                    Next &gt;&gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
