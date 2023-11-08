"use client";
import { signOut, useSession } from "next-auth/react";
import { Cabin, Merriweather, Poppins } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import shouldShowHeader from "../utils/shouldShowHeader";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, useAppSelector } from "../store/store";
const cabin = Cabin({ subsets: ["latin"] });
const poppins = Poppins({ weight: "400", subsets: ["latin"] });
const merryweather = Merriweather({ weight: "400", subsets: ["latin"] });

function Header() {
  const router = useRouter()
  const [showHeader, setShowHeader] = useState(false);
  const [showContextMenu, setshowContextMenu] = useState(false);
  const { data: session, status } = useSession();
  const cart = useAppSelector((state) => state.cart.items);
  const path = usePathname();
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResut] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false)

  useEffect(() => {
    setShowHeader(shouldShowHeader(path));
  }, [path]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 0) {
        fetch(`/api/product?page=1&limit=5&query=${query}`)
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((res) => setSearchResut(res.data.products))
          .catch((err) => console.log("error"));
      }
    }, 650);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <>
      {showHeader && (
        <div className="pt-9 px-4 md:px-16 pb-4 fixed left-0 top-0 right-0 flex justify-between items-center rounded-xl bg-white">
          <div className="flex space-x-6 w-3/5 md:w-3/5">
            <Link
              href="/"
              className={`hidden md:flex ${merryweather.className} text-4xl font-extrabold text-purple-600`}
            >
              Dshop
            </Link>
            <div className="relative border border-1 flex-1 rounded-md w-full flex items-center px-4 py-2 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>

              <div
                onMouseLeave={() => {
                  setShowResult(false);
                }}
              >
                <input
                  className="outline-none w-full px-2"
                  placeholder="Search Product"
                  onChange={(e) => {
                    setShowResult(e.target.value.length > 0);
                    setQuery(e.target.value);
                  }}
                ></input>
                <div className="w-full flex justify-start items-start">
                  <div
                    className={`${
                      showResult && searchResult.length > 0 ? "" : "hidden"
                    } absolute w-full z-10 bg-white divide-y divide-gray-100 rounded-lg shadow`}
                  >
                    <ul className="py-2 text-sm text-gray-700">
                      {searchResult.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={`/${item.id}`}
                            className="w-full flex space-x-6 p-3 text-lg"
                          >
                            <img src={item.image1} className="w-8 h-8" />
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-6 w-2/5 md:w-2/5">
            <div className="flex space-x-4 items-center w-full justify-end">
              {status === "unauthenticated" && (
                <>
                  <Link
                    href="/register"
                    className={`hidden md:flex ${poppins.className} text-purple-600 font-bold text-lg px-4 py-2 border border-purple-600 rounded-md`}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className={`${poppins.className} text-white font-bold text-sm md:text-lg px-4 py-2 bg-purple-600 rounded-md`}
                  >
                    Login
                  </Link>
                </>
              )}
              {status === "authenticated" && (
                <div className="flex flex-col">
                  <button type="button" onClick={() => {setShowMobileNav(prev => !prev)}} className="flex md:hidden justify-end items-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </button>
                    </div>
              )}

              {status === "authenticated" && (
                <div className="hidden md:flex flex-row space-x-6">
                  <Link href="/cart" className="relative inline-block">
                    {cart.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
                    )}
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                    </span>
                  </Link>
                  <Link href="/favorite">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </Link>
                  <span></span>
                  <div className="flex flex-col">
                    <button
                      className="flex space-x-3"
                      onMouseEnter={() => {
                        setshowContextMenu(true);
                      }}
                    >
                      <img
                        className="h-6 w-6"
                        src="https://lh3.googleusercontent.com/a/ACg8ocJFG-atBFgJQ_DkXBFXEFqmJL36jagS53b47fhZkiZRSQ=s96-c"
                      />
                      <span>{session.user?.name?.split(" ")[0]}</span>
                    </button>
                    <div>
                      <div
                        onMouseLeave={() => {
                          setshowContextMenu(false);
                        }}
                        className={`${
                          showContextMenu ? "" : "hidden"
                        } absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
                      >
                        <ul className="py-2 text-sm space-y-4 text-gray-700">
                          <li>
                            <Link href={"/order"} className="w-full flex px-2">
                              Order
                            </Link>
                          </li>
                          <li>
                            <button
                              className="w-full flex px-2"
                              onClick={() => {
                                signOut();
                              }}
                            >
                              Sign Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {
<div className="md:hidden w-full flex flex-col">
                      <div
                        className={`${
                          showMobileNav ? "" : "hidden"
                        } justify-start items-center absolute z-10 bg-white mt-24 divide-y divide-gray-100 rounded-lg shadow w-full h-screen`}
                      >
                        <ul className="w-full py-2 space-y-6 text-gray-700 text-xl font-bold">
                        <li className="text-center w-full">
                            <button onClick={() => {router.replace('/')}} className="flex items-center justify-center text-center w-full">
                              Home
                            </button>
                          </li>
                          <li className="text-center w-full">
                            <button onClick={() => {router.replace('/order')}} className="flex items-center justify-center text-center w-full">
                              Order
                            </button>
                          </li>
                          <li>
                            <button
                              className="flex items-center justify-center text-center w-full"
                              onClick={() => {
                                signOut();
                              }}
                            >
                              Sign Out
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
}
    </>
  );
}

export default Header;
