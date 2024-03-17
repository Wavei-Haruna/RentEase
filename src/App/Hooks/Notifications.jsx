import React, { useState } from 'react'
import NotifyImage from '../../assets/Images/notifications.png'

export default function Notifications() {

  const [notifications, setNotifications] = useState([])

  if( notifications.length === 0){
    return <div className='relative w-full p-2 m-2'>
      
      <div className='flex flex-col justify-center items-center h-full w-full'>
        <img src={NotifyImage}  alt="oops No Notifications"  className=' bg-contain bg-center h-[200px]'/>

        <p className='text-primary font-menu'>0 Notifications</p>
      </div>

    </div>
  }
  return (
    <div>Notifications</div>
  )
}
