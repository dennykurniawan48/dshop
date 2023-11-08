'use client'
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const router = usePathname()
  return (
    <div className="w-full h-screen flex">
      {router != "/admin/login" && <><div className="w-1/5 bg-purple-600 text-white p-4 z-11 flex flex-col justify-between">
        <ul className="flex flex-col space-y-2">
          <li className="flex flex-row items-center mb-2">
            <Link href="#" className="w-full flex items-end space-x-2 ">
              <span className="px-3 py-1 bg-white text-2xl text-purple-600 rounded-md font-extrabold">
                D
              </span>
              <span>Shop</span>
            </Link>
          </li>

          <li className="flex flex-row space-x-2 items-center px-3 py-1 hover:bg-purple-400">
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
                d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
              />
            </svg>

            <Link className="w-full flex px-3 py-2" href="/admin">
              Dashboard
            </Link>
          </li>
          <li className="flex flex-row space-x-2 items-center px-3 py-1 hover:bg-purple-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
</svg>


            <Link className="w-full flex px-3 py-2" href="/admin/user">
              Users
            </Link>
          </li>
          <li className="flex flex-row space-x-2 items-center px-3 py-1 hover:bg-purple-400">
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
                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
              />
            </svg>

            <Link className="w-full flex px-3 py-2" href="/admin/order">
              Order
            </Link>
          </li>
          <li className="flex flex-row space-x-2 items-center px-3 py-1 hover:bg-purple-400">
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
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6h.008v.008H6V6z"
              />
            </svg>

            <Link className="w-full flex px-3 py-2" href="/admin/category">
              Category
            </Link>
          </li>

          <li className="flex flex-row space-x-2 items-center px-3 py-1 hover:bg-purple-400">
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
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>

            <Link className="w-full flex px-3 py-2" href="/admin/product">
              Product
            </Link>
          </li>
        </ul>
        <div className="w-full flex flex-row ">
          <button  onClick={() => {signOut()}} className="w-full flex flex-row bg-purple-800 py-2 px-4 justify-between"><span>Sign Out</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
</svg>
</button>
        </div>
      </div>
      <div className="w-4/5 overflow-y-auto">
        <div className="flex flex-col">
        
        <div className="relative w-full h-screen mt-3"> 
  {children}
        </div>
      </div>
    </div></>}
    {router === '/admin/login' && <div>{children}</div>}
    </div>
  );
}

export default Layout;
