import React from "react";
import LoadingHeader from "../loadingcomponent/header";

function Loading() {
  return (
    <div className="flex w-full flex-col space-y-28 animate-pulse p-6">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <LoadingHeader />
      </div>
      <div className="w-full h-screen flex flex-col px-12">
        <div className="w-[180px] h-8 bg-slate-400"></div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 mt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <div className="w-full aspect-square bg-slate-300" key={item}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;
