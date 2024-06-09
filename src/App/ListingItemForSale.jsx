import moment from 'moment';
import React, { useState } from 'react';
import { MdKitchen, MdLocationOn } from 'react-icons/md';
import { FaBed } from 'react-icons/fa';
import { FaBath } from 'react-icons/fa';


export default function ListingItemForSale({ listing, id,  }) {

  

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };



  const date = moment(listing?.timeStamp?.seconds * 1000);
  return (
    <div className='bg-white  rounded-lg shadow-md p-6 space-y-4'>
      <div className='relative w-full h-64'>
        <img src={listing.imgUrls[0]} alt="" className='w-full h-full transition-all ease-in duration-150  object-cover rounded-lg hover:scale-105 cursor-pointer' />
       
        <div className='absolute top-1 left-2  flex items-center justify-center bg-black p-2 bg-opacity-60 rounded-tl-md  rounded-br-md'>
          <MdLocationOn className='text-white mr-1' size={20} />
          <p className='text-sm text-white font-semibold capitalize'>{listing.town}</p>
        </div>
        <p className='absolute top-1 right-2 text-xs text-white bg-black p-2 bg-opacity-60 rounded-tl-md  rounded-br-md'>{date.fromNow()}</p>
       
          <div className="absolute bottom-1 left-2 text-xs text-white font-semibold bg-black p-2 bg-opacity-60 rounded-tl-md  rounded-br-md ">          {listing.type === 'sell' ? <p>For Sale : GHs {listing.price}</p> : <p>For Rent : GHs {listing.price}</p>}
</div>

        
       
      </div>
      <div className=''>
        <div className='flex justify-between items-center'>

        <p className='text-sm font-bold capitalize'>{listing.name}</p>
          
          <div className='flex justify-between items-center'>
          <p className='text-sm flex justify-center items-center   font-semibold'>
         
            <MdKitchen size={20} className=' mr-1 text-primary' />
            <span className='text-cyan-600 mr-1'>Kitchen: </span> {listing.kitchen ? ' Yes' : ' No'}
          </p>
          <p className='text-sm flex justify-center items-center  font-semibold'>
            <FaBath size={18} className=' ml-4 mr-1 text-primary' />
            <span className='text-lime-600 mr-1'>Bathroom: </span> {listing.bathroom ? ' Yes' : ' No'}
          </p>
          
          </div>


        </div>
        <div className='flex justify-center space-x-4 my-2'> 
          
        <p className='text-sm font-semibold flex '>
        <FaBed size={20} className=' mr-1 text-primary' />
            <span className='text-pink-600'>Bedroom:</span> {listing.bedroom}
          </p><p className='text-sm font-bold'>
            <span className='text-orange-600'>Hall:</span> {listing.hall}
          </p>
          
          <p className='text-sm font-bold'>
            <span className='text-teal-600'>Toilet:</span> {listing.toilet ? 'Yes' : 'No'}
          </p>
        <div className='flex-1'>
          <p className='text-sm '>
            <span className='text-indigo-600'></span> {listing.landMark}
          </p>
          
        </div>
        
        </div>
         
      </div>
    </div>
  );
}