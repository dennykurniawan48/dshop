'use client'
import React from 'react'

function Add(props: {open: boolean, children: React.ReactNode}) {
  return (
    <div className={`fixed inset-0 transition-colors flex justify-center items-start z-10 overflow-y-scroll ${props.open ? "visible scale-100 bg-opacity-60" : "invisible scale-0 opacity-0"}`}>
      {props.children}
    </div>
  )
}

export default Add