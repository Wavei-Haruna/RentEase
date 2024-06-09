import React, { useEffect, useState } from 'react'
import { db } from '../firebase'


import {collection, query, where, orderBy, getDocs,} from 'firebase/firestore';
import ListingItemForSale from './ListingItemForSale';




//  fetch listings


export default function ForRent() {
  const [listingsForSale, setListingsForSale] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
   const fetchListings = async ()=>{
    try {
      const docRef = collection(db, 'listings');
      const q = query(docRef, where('type', '==', 'rent'), orderBy('timeStamp', 'desc')) 
      const querySnap = await getDocs(q);

      const listingData = [];
      //   Iterate through the results
      querySnap?.forEach((doc) => {
        listingData.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListingsForSale(listingData);
      console.log(listingData)
     
      setLoading(false);

    } catch (error) {
      console.log(error)
      

    }
   }
   fetchListings();
  },[])


 if(loading) return <div>Loaiding...</div>
 else
 
  return (
    <div className='mx-auto max-w-6xl'>
     <h1 className="relative  mx-auto my-12
     2 w-fit rounded-lg border-l-4 border-r-4 border-secondary px-2 font-header text-xl font-bold text-gray-600">
        Rooms for Rent
      </h1>
      { console.log(listingsForSale)}
      <ul className='grid md:grid-cols-3 gap-5'>
      {listingsForSale.map((listing)=> (<ListingItemForSale key={listing.id}  listing={listing.data} />))}
      </ul>
    </div>
  )
}
