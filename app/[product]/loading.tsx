import React from "react";
import LoadingHeader from "../loadingcomponent/header";

function Loading() {
  return (
    <div className="w-full flex flex-col animate-pulse">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <LoadingHeader />
      </div>
      <div className={`w-full flex items-center mt-24 px-6 lg:px-12 py-6`}>
        <div className="flex flex-col lg:px-12 w-full">
          <div className="flex flex-col lg:flex-row space-y-8 lg:flex-y-0 lg:space-x-12 w-full">
            <div className="flex w-full lg:w-2/6">
              <div className="w-full space-y-4">
                <div className="w-full aspect-square">
                  <div className="w-full aspect-square bg-slate-400" />
                </div>
                <div className="w-full grid grid-cols-4 gap-4">
                  <div className="w-full aspect-square bg-slate-300" />
                </div>
              </div>
            </div>
            <div
              className="w-full flex-col space-y-10"
            >
                <div className={`flex w-[280px] flex-col h-[140px] bg-slate-300`}>

                </div>
                <div className={`flex w-[280px] flex-col h-[20px] bg-slate-300`}>

                </div>
                <div className={`flex w-[280px] flex-col h-[60px] bg-slate-300`}>

                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
