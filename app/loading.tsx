import React from "react";
import LoadingHeader from "./loadingcomponent/header";

function Loading() {
  return (
    <div className="w-full h-screen animate-pulse">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <LoadingHeader />
      </div>
      <div
        className={`w-full flex flex-col space-y-6 mt-24 lg:px-24 px-6 py-6`}
      >
        <div className="w-full h-[240px] rounded-lg bg-slate-400"></div>
        <div className="w-[200px] py-6 bg-slate-400"></div>
        <div className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 text-md]">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="w-full aspect-square bg-slate-300" key={item}/>
          ))}
        </div>
        <div className="w-[200px] py-6 bg-slate-400"></div>
        <div className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-md]">
          {[...new Array(12)].map((item) => (
            <div className="w-full aspect-square bg-slate-300" key={item}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;
