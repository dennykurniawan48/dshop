'use client'
import React, { useEffect, useState } from 'react'

function Slider(props:{data:{id:string, image:string}[]}) {
  const [sliderPosition, setSliderPosition] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Call your function here
      setSliderPosition((prev) => prev === props.data.length-1 ? 0 : prev+1);

    }, 5000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [sliderPosition])
  return (
    <div className='w-full h-auto rounded-lg'>
      <img src={props.data[sliderPosition].image} className='w-full h-auto rounded-md' />
    </div>
  )
}

export default Slider