'use client'
import React from 'react'

function LoadCategories() {
  return (
    <div className="flex flex-col space-y-3 text-sm text-gray-500">{[1, 2, 3, 4].map((item) => {
      return <div className="w-18 bg-slate-400 h-6" key={item}/>;
    })}</div>
  )
}

export default LoadCategories