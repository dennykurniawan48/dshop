"use client";
import { addItem } from "@/app/store/feature/cartSlice";
import { AppDispatch } from "@/app/store/store";
import { getSession, useSession } from "next-auth/react";
import { Poppins } from "next/font/google";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const poppins800 = Poppins({ weight: "800", subsets: ["latin"] });
const poppins400 = Poppins({ weight: "400", subsets: ["latin"] });

function Addcart(props: { price: number; availableStock: number; id: string }) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/favorite/${props.id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => setIsFav(res.data.isExist))
      .catch((err) => console.log("error"));
  });

  return (
    <div className="mt-12">
      <span className={`${poppins800.className} text-2xl text-orange-600`}>
        $ {props.price}
      </span>

      <div className="flex flex-row space-x-4 items-center mt-12">
        <div className="w-24 px-4 py-2 border border-purple-600 rounded-md flex justify-between items-center">
          <button
            onClick={() => {
              setQty((prev) => (prev > 1 ? prev - 1 : prev));
            }}
          >
            -
          </button>
          <input className="w-12 outline-none text-center" value={qty} />
          <button
            onClick={() => {
              setQty((prev) =>
                prev + 1 > props.availableStock ? prev : prev + 1
              );
            }}
          >
            +
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              if (status === "unauthenticated") {
                setError("You need to login.");
              }
              else{
                if (isFav) {
                  fetch(`/api/favorite?id=${props.id}`, {
                    method: "DELETE",
                  })
                    .then((res) => {
                      if (res.ok) {
                        return res.json();
                      }
                    })
                    .then((res) => {})
                    .catch((err) => console.log("Error"));
                } else {
                  fetch("/api/favorite", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productId: props.id }),
                  })
                    .then((res) => {
                      if (res.ok) {
                        return res.json();
                      }
                    })
                    .then((res) => {})
                    .catch((err) => console.log("Error"));
                }
                setIsFav((prev) => !prev);
              }
            }}
            className="border border-gray-500 rounded-md p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className={`${isFav ? "fill-red-500" : ""} w-6 h-6`}
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>
      </div>
      {error && <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
  <strong className="font-bold">{error}</strong>
</div>}
      <div className="mt-8">
        <span className={`${poppins400.className} text-md`}>
          Available Stock: {props.availableStock}
        </span>
      </div>
      <div className="mt-6">
        <button
          className="px-4 py-2 bg-purple-600 text-white"
          onClick={() => {
            if(status === "authenticated"){
            dispatch(addItem({ id: props.id, qty }));}else{
              setError("You need to login.");
            }
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default Addcart;
