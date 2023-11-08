import React from 'react'

function Thumbnail(props:{image: string, setImage: React.Dispatch<React.SetStateAction<string | undefined>>; }) {
  return (
    <button className='aspect-square w-full border border-gray-400 rounded-md' onClick={()=>{
      props.setImage(props.image)
    }}>
        <img src={props.image} className='w-full aspect-square' />
    </button>
  )
}

export default Thumbnail