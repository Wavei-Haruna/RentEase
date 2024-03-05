import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection,  deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Spinner from './Spinner';
import ListingItem from './ListingItem';
import EditListing from './EditListing';
import { toast } from 'react-toastify';

export default function GetListings() {
  const auth = getAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  //  adding the delete functionality

  const onDelete = async(id)=>{
    try {
      await deleteDoc(doc(db, 'listings', id));
      console.log('Document deleted successfully');
      const newListings = listings.filter((listing) => listing.id !== id);
      setListings(newListings);

      alert('Are you sure you want delete listing?')
      toast.success('Deleted')
    } catch (error) {
      console.log('Error deleting document:', error);
      toast.error("oops their is an error");

    }
  }
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
        setLoading(false);
      } catch (error) {
        
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.currentUser.uid]);

  const onEdit = (listing) => {
    
    setSelectedListing(listing);
    setShowEditModal(true);
  };

  if (loading && listings.length > 0) {
    return <Spinner />;
  } else
    return (
      <div>
        <h2 className="text-center font-header font-semibold">My Listings</h2>
        <ul className='grid md:grid-cols-3 gap-5'>
          {listings?.map((listing) => (
            <ListingItem key={listing.id} onEdit={onEdit} onDelete={onDelete} id={listing.id} listing={listing.data} />
          ))}
        </ul>
        {selectedListing && showEditModal && <EditListing listing={selectedListing} onClose={() => setShowEditModal(false)} />}

      </div>
    );
}
