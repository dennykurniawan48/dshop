import LoadingHeader from '@/app/loadingcomponent/header'
import React from 'react'

function Loading() {
  return (
    <div className="flex w-full flex-col animate-pulse mt-24 px-6">
      <div className="z-10 w-full items-start justify-between font-mono text-sm bg-white">
        <LoadingHeader />
      </div>
      <div className='flex mx-32 space-x-24'>
        <div className='w-3/5 h-[800px] bg-slate-400'/>
        <div className='w-2/5 h-[400px] bg-slate-400' />
      </div>
      </div>
  )
}

export default Loading