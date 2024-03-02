import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Spinner from './Spinner';
import ListingItem from './ListingItem';

export default function GetListings() {
  const auth = getAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = collection(db, 'listings');
        const q = query(docRef, where('userRef', '==', auth.currentUser.uid), orderBy('timeStamp', 'desc'));

        const querySnap = await getDocs(q);
        console.log(querySnap);
        const listingData = [];
        //   Iterate through the results
        querySnap?.forEach((doc) => {
          listingData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listingData);
        console.log(listingData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.currentUser.uid]);

  if (loading && listings.length > 0) {
    return <Spinner />;
  } else
    return (
      <div>
        <h2 className="text-center font-header font-semibold">My Listings</h2>
        <ul>
          {listings?.map((listing) => (
            <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
          ))}
        </ul>
      </div>
    );
}
