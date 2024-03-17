import React, { useState } from 'react'

import ReviewMessage from '../assets/Images/reviews.png'

export default function Reviews() {
const [messages, setMessages] = useState([])
    if( messages.length === 0){
        return <div className='relative w-full p-2 m-2'>
          
          <div className='flex flex-col justify-center items-center h-full w-full'>
            <img src={ReviewMessage}  alt="oops No Notifications"  className=' bg-contain bg-center h-[200px]'/>
    
            <p className='text-primary font-menu'>0 Reveiws</p>
          </div>
    
        </div>
      }
  return (
    <div>Reviews</div>
  )
}
