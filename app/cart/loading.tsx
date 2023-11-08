import React from "react";
import LoadingHeader from "../loadingcomponent/header";

function Loading() {
  return (
    <div className="flex w-full flex-col space-y-8 animate-pulse p-6">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <LoadingHeader />
      </div>
      <div className="w-full flex lg:space-x-8">
        <div className="w-full lg:w-4/5 h-screen lg:mx-12 px-16 mt-28 bg-slate-400"></div>
        <div className="hidden lg:flex h-80 w-1/5 lg:flex-row items-start px-6 lg:p-16 mt-28 bg-slate-300 mr-4"></div>
      </div>
    </div>
  );
}

export default Loading;
