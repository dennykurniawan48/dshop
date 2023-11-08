import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-screen h-screen'>{children}</div>
  )
}

export default Layout