import React from "react";
import LoadingHeader from "../loadingcomponent/header";
import LoadCategories from "./loadCategories";
import LoadOrder from "./loadOrder";

function Loading() {
  return (
    <div className="flex w-full flex-col animate-pulse mt-24 px-6">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <LoadingHeader />
      </div>
      <div className="w-full h-screen flex flex-row px-12">
        <div className="w-full md:w-1/5 flex flex-col space-y-4">
          <span className="text-md font-bold bg-slate-400 h-6 w-1/2"/>
            <LoadCategories/>
        </div>
        <LoadOrder/>
      </div>
    </div>
  );
}

export default Loading;
