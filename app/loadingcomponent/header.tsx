import { Merriweather, Poppins } from "next/font/google";
import React from "react";
const poppins = Poppins({ weight: "400", subsets: ["latin"] });
const merryweather = Merriweather({ weight: "400", subsets: ["latin"] });

function LoadingHeader() {
  return (
    <>
      <div className="pt-9 px-4 md:px-16 pb-4 fixed left-0 top-0 right-0 flex justify-between items-center rounded-xl bg-white">
        <div className="flex space-x-6 w-3/5 md:w-3/5">
          <div
            className={`hidden md:flex ${merryweather.className} text-4xl font-extrabold bg-slate-400 w-40 h-10`}
          ></div>
          <div className="relative border border-1 flex-1 rounded-md w-full flex items-center px-4 py-2 bg-slate-300 ">
            <div className="w-6 h-6 bg-slate-300"></div>

            <div>
              <div
                className="outline-none w-full px-2 bg-slate-300"
                placeholder="Search Product"
              ></div>
              <div className="w-full flex justify-start items-start">
                <div
                  className={`absolute w-full z-10 divide-y divide-gray-100 rounded-lg shadow bg-slate-400`}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-6 w-2/5 md:w-2/5">
          <div className="flex space-x-4 items-center w-full justify-end">
            <div
              className={`hidden md:flex ${poppins.className} text-purple-600 font-bold text-lg w-14 h-10 bg-slate-500 py-2 border rounded-md`}
            ></div>
            <div
              className={`${poppins.className} text-white font-bold text-sm md:text-lg w-14 h-10 bg-slate-500 rounded-md`}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadingHeader;
