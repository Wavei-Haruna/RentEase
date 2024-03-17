
import React, {useState} from 'react'
import MessageImage from '../assets/Images/messages.png'

export default function Messages() {

    const [messages, setMessages] = useState([])
    if( messages.length === 0){
        return <div className='relative w-full p-2 m-2'>
          
          <div className='flex flex-col justify-center items-center h-full w-full'>
            <img src={MessageImage}  alt="oops No Notifications"  className=' bg-contain bg-center h-[200px]'/>
    
            <p className='text-primary font-menu'>0 Messages</p>
          </div>
    
        </div>
      }
  return (
    <div>Messages</div>
  )
}
