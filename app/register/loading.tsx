import React from 'react'

function Loading() {
  return (
    <div
      className={`w-full flex items-center mt-6 px-6 lg:px-24 py-4 animate-pulse`}
    >
      <div className="w-full h-full flex justify-center items-center">
        <div className="hidden md:w-3/5 md:flex items-center justify-center">
          <div className="m-16 w-[400px] aspect-square bg-slate-500" />
        </div>
        <div className="w-full md:w-2/5 flex items-center justify-center mx-8">
          <div className="w-full mx-4 border border-1  space-y-4 border-gray-300 rounded-lg px-6 py-2 flex flex-col justify-center">
            <div className="w-full flex items-center justify-center">
              <span className="text-xl w-[160px] h-[30px] text-center bg-slate-400"></span>
            </div>
            <div className="w-full flex items-center justify-center">
              <span className="text-xl w-[240px] h-[30px] text-center bg-slate-300"></span>
            </div>
            <div className="flex flex-row items-center mt-2 justify-center space-x-2 h-6 bg-slate-300"></div>
            <div className=" mt-4">
              <label className="block text-sm font-medium leading-6 bg-slate-300 w-[20px]"></label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="outline-none block w-full rounded-md border-0 py-1.5 pl-12 pr-20 sm:text-sm sm:leading-6 bg-slate-300" />
              </div>
            </div>
            <div className=" mt-4">
              <label className="block text-sm font-medium leading-6 bg-slate-300 w-[20px]"></label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="outline-none block w-full rounded-md border-0 py-1.5 pl-12 pr-20 sm:text-sm sm:leading-6 bg-slate-300" />
              </div>
            </div>
            <div className=" mt-4">
              <label className="block text-sm font-medium leading-6 bg-slate-300 w-[20px]"></label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="outline-none block w-full rounded-md border-0 py-1.5 pl-12 pr-20 sm:text-sm sm:leading-6 bg-slate-300" />
              </div>
            </div>
            <div className=" mt-3">
              <label className="block text-sm font-medium leading-6 bg-slate-300 w-[20px]"></label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="outline-none block w-full rounded-md border-0 py-1.5 pl-12 pr-20 bg-slate-300 sm:text-sm sm:leading-6" />
                <div className="absolute inset-y-0 right-0 flex items-center mr-4">
                  <button
                    type="button"
                    className="w-[40px] aspect-square bg-slate-300"
                  ></button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-slate-400 text-white py-4"
            ></button>
            <button
              type="button"
              className="mt-6 w-full bg-slate-300 py-4"
            ></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading