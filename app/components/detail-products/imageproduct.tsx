'use client'
import React, { useState } from 'react'
import Thumbnail from './thumbnail'
import { data } from 'autoprefixer';

function ImageProduct(props:{ data: (string | undefined)[]; }) {
  const [selectedImage, setSelectedImage] = useState(props.data[0])
  return (
    <div className='w-full space-y-4'>
        <div className='w-full aspect-square'>
            <img src={selectedImage} className='w-full' />
        </div>
        <div className='w-full grid grid-cols-4 gap-4'>
          {props.data.map(image =>(
            <Thumbnail image={image!} setImage={setSelectedImage} key={image}/>
          ))}
        </div>
    </div>
  )
}

export default ImageProduct