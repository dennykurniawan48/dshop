"use client";
import Link from "next/link";
import React from "react";

type Product = { id: string; name: string; categoryId: string; image1: string; price: number; averageRating: number; };

function Productitem(props: { data: Product }) {
  return (
    <Link
      href={`/${props.data.id}`}
      key={props.data.id}
      className="p-2 flex flex-col h-full border-gray-400 border"
    >
      <img src={props.data.image1} className="w-full aspect-square" />
      <div className="w-full space-y-1">
        <span className="text-sm font-bold line-clamp-2">
          {props.data.name}
        </span>
        {props.data.averageRating !== 0 && (
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
            {Math.round((props.data.averageRating ?? 0) *10)/10}
          </span>
        )}
        
      </div>
      <span className="text-md text-orange-500 font-bold mt-3">$ {props.data.price}</span>
    </Link>
  );
}

export default Productitem;
