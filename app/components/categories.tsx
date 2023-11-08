import { Poppins } from 'next/font/google'
import React from 'react'
import Categoryitem from './categoryitem'
import { prisma } from '../utils/prisma'
const poppins = Poppins({weight: "600", subsets: ['latin']})

async function Categories() {
  const data = await prisma.category.findMany()

  return (
    <div className='w-fullflex flex-col space-y-4'>
        <span className={`${poppins.className} text-lg `}>
            All Categories
        </span>
        <div className='grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 text-md'>
          {data.map(cat => <Categoryitem data={cat} key={cat.id}/>)}
        </div>
    </div>
  )
}

export default Categories