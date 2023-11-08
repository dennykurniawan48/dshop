import Link from 'next/link'
import React from 'react'

interface Category{
  id: string, name: string, thumbnail: string
}

function Categoryitem(props: {data: Category}) {
  return (
    <Link href={`?cat=${props.data.id}`} className='w-full border border-gray-400 rounded-md text-xs md:text-sm md:text-md text-center p-4'>
      <img src={props.data.thumbnail} className='w-full aspect-square p-4'/>
      <span>{props.data.name}</span>
    </Link>
  )
}

export default Categoryitem