import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import ListingItemForSale from './ListingItemForSale';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

export default function ForRent() {
  const [listingsForRent, setListingsForRent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const docRef = collection(db, 'listings');
        const q = query(docRef, where('type', '==', 'rent'), orderBy('timeStamp', 'desc'));
        const querySnap = await getDocs(q);

        const listingData = [];
        querySnap?.forEach((doc) => {
          listingData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListingsForRent(listingData);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div className='mx-auto max-w-6xl'>
      <h1 className="relative mx-auto my-12 w-fit rounded-lg border-l-4 border-r-4 border-secondary px-2 font-header text-xl font-bold text-gray-600">
        Rooms for Rent
      </h1>
      <ul className='grid md:grid-cols-3 gap-5'>
        {listingsForRent.map((listing) => (
          <div key={listing.id} onClick={() => navigate(`/listing/${listing.id}`)}>
            <ListingItemForSale listing={listing.data} id={listing.id} />
          </div>
        ))}
      </ul>
    </div>
  );
}
