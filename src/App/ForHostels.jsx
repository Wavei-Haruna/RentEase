// components/ForHostels.js
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import ListingItemForSale from './ListingItemForSale';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from './SkeletonLoader'; // Import SkeletonLoader
import { ActiveRouteProvider } from '../Components/Helpers/Context';
import Header from '../Components/Header';

export default function ForHostels() {
  const [hostelListings, setHostelListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostelListings = async () => {
      try {
        const docRef = collection(db, 'listings');
        const q = query(docRef, where('type', '==', 'hostel'), orderBy('timeStamp', 'desc'));
        const querySnap = await getDocs(q);

        const hostelData = [];
        querySnap?.forEach((doc) => {
          hostelData.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setHostelListings(hostelData);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHostelListings();
  }, []);

  if (loading) return <SkeletonLoader count={6} />; // Use SkeletonLoader while loading

  return (
    <div className="mx-auto max-w-6xl">
      <ActiveRouteProvider>
        <Header />
      </ActiveRouteProvider>
      <h1 className="relative mx-auto my-12 w-fit rounded-lg border-l-4 border-r-4 border-secondary px-2 font-header text-xl font-bold text-gray-600">
        Hostels Available
      </h1>
      <ul className="grid gap-5 md:grid-cols-3">
        {hostelListings.map((listing) => (
          <div key={listing.id} onClick={() => navigate(`/listing/${listing.id}`)}>
            <ListingItemForSale listing={listing.data} id={listing.id} />
          </div>
        ))}
      </ul>
    </div>
  );
}
