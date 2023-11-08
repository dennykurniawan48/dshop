import React from 'react'

function LoadOrder() {
  return (
    <div className={`w-full md:w-4/5 flex flex-col space-y-4 items-center`}>
          <div className="w-full flex justify-start">
            <span className="text-xl font-bold h-8 bg-slate-400"/>
          </div>
          {[1,2,3,4,5,6,7].map((item) => (
            <div
              key={item}
              className="w-full rounded-md px-6 py-1 flex flex-col space-y-4"
            >
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 w-64 bg-slate-400 h-6"/>
                <span className="text-xs text-gray-600 font-bold mr-4 w-12 bg-slate-400"/>
                
              </div>
              <div className="flex flex-col space-y-3">
                {[1,2,3].slice(0, 1).map((detail) => (
                  <div className="flex flex-col" key={detail}>
                    <div className="flex flex-row space-x-8">
                      <span className="w-12 h-12 bg-slate-400" />
                      <div className="w-full flex flex-col space-y-1">
                        <div className="w-full flex justify-between">
                          <span className="text-xs text-gray-400 w-32 h-4 bg-slate-400"/>
                        </div>

                        <span className="text-xs text-gray-400 h-4 w-64 bg-slate-400"/>
                        <span className="text-xs text-gray-400 h-4 w-32 bg-slate-400"/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-row justify-end">
                <span className="text-xs text-gray-400 w-24 h-10 bg-slate-400"/>
              </div>
            </div>
          ))}
        </div>
  )
}

export default LoadOrder