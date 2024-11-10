import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { FaSearch, FaBed } from 'react-icons/fa';
import { MdLocationOn, MdKitchen, MdWater } from 'react-icons/md';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; // Add updateDoc
import { FaCediSign } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { AiFillEye } from 'react-icons/ai';

export default function ListingsFilter() {
  const [listings, setListings] = useState([]);
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [region, setRegion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [viewCounts, setViewCounts] = useState({}); // State to track view counts

  const navigate = useNavigate();

  const handleClick = async (id) => {
    try {
      const viewedListings = JSON.parse(localStorage.getItem('viewedListings')) || [];

      if (!viewedListings.includes(id)) {
        viewedListings.push(id);
        localStorage.setItem('viewedListings', JSON.stringify(viewedListings));

        const listingRef = doc(db, 'listings', id);

        // Update Firestore and local view count state
        await updateDoc(listingRef, { views: (viewCounts[id] || 0) + 1 });

        setViewCounts((prev) => ({
          ...prev,
          [id]: (prev[id] || 0) + 1,
        }));
      }

      navigate(`/listing/${id}`);
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  // Fetch listings from Firebase
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings'));
        const fetchedListings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Initialize view counts from fetched data
        const initialViewCounts = {};
        fetchedListings.forEach((listing) => {
          initialViewCounts[listing.id] = listing.views || 0;
        });
        setViewCounts(initialViewCounts);
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    fetchListings();
  }, []);
  // Filter Listings with delay (debounce effect)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const result = listings.filter((listing) => {
        return (
          (!category || listing?.type === category) &&
          (!region || listing?.region === region) &&
          listing?.price >= priceRange[0] &&
          listing?.price <= priceRange[1] &&
          (!searchQuery || listing?.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
      setFiltered(result);
    }, 300); // 300ms delay to simulate debounce

    return () => clearTimeout(timeout);
  }, [listings, category, priceRange, region, searchQuery]);

  return (
    <div className="w-full rounded-lg bg-gray-100 p-4 font-body text-gray-500 shadow-md">
      {/* Filter Bar */}
      <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* Category Select */}
        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border p-2 focus:border-primary focus:outline-none"
          >
            <option value="">All Categories</option>
            {['sell', 'rent', 'hostel'].map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'sell' ? 'For Sale' : cat === 'rent' ? 'For Rent' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Slider */}
        <div className="flex items-center gap-2">
          <FaCediSign size={24} className="text-primary" />
          <Slider range min={0} max={10000} value={priceRange} onChange={setPriceRange} className="w-48" />
          <span className="text-sm text-gray-600">
            {priceRange[0]} - {priceRange[1]} Cedis
          </span>
        </div>

        {/* Region Select */}
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-lg border p-2 focus:border-primary focus:outline-none"
        >
          <option value="">All Regions</option>
          {['Greater Accra', 'Ashanti'].map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border p-2 pl-10 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Listings Display */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((listing) => (
            <div key={listing.id} className="space-y-4 rounded-lg bg-white p-6 shadow-md">
              <div className="relative h-64 w-full">
                <img
                  src={listing.imgUrls[0]}
                  alt=""
                  className="h-full w-full cursor-pointer rounded-lg object-cover transition-all duration-150 ease-in hover:scale-105"
                  onClick={() => handleClick(listing.id)}
                />
                <div className="absolute left-2 top-1 flex items-center rounded-br-md rounded-tl-md bg-black bg-opacity-60 p-2">
                  <MdLocationOn className="mr-1 text-white" size={20} />
                  <p className="text-sm text-white">{listing.town}</p>
                </div>
                <p className="absolute right-2 top-1 rounded-br-md rounded-tl-md bg-black bg-opacity-60 p-2 text-xs text-white">
                  {moment(listing?.timeStamp?.seconds * 1000).fromNow()}
                </p>

                <div className="absolute bottom-1 left-2 rounded-br-md rounded-tl-md bg-black bg-opacity-60 p-2 text-xs text-white">
                  {listing.type === 'sell' ? `For Sale: GHs ${listing.price}` : `For Rent: GHs ${listing.price}`} /
                  {listing.priceFrequency}
                </div>
                <div className="absolute bottom-1 right-2 flex items-center rounded-br-md rounded-tl-md bg-black bg-opacity-60 p-2 text-xs text-white">
                  <AiFillEye className="mx-3" /> {viewCounts[listing.id] || 0}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-body text-lg font-semibold capitalize text-primary">{listing.name}</p>
                  {listing.type === 'hostel' && (
                    <p>
                      {' '}
                      <span className="font-semibold">{listing.numberOfPeople}</span> in a room
                    </p>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="flex items-center font-medium text-secondary">
                    <MdKitchen size={18} className="mr-1 text-yellow-600" />
                    Kitchen: {listing.kitchen ? 'Yes' : 'No'}
                  </p>
                  <p className="flex items-center text-secondary">
                    <MdWater size={18} className="mr-1 text-blue-300" />
                    Bathroom: {listing.bathroom ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="mt-4 flex items-center space-x-4 text-secondary">
                  <p className="flex items-center">
                    <FaBed size={18} className="mr-1" />
                    Bedroom: {listing.bedroom}
                  </p>
                  <p>Toilet: {listing.toilet ? 'Yes' : 'No'}</p>
                </div>
                <p className="mt-4 flex items-center text-sm text-gray-800">{listing.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No listings found. Adjust your filters to view more options.</p>
        )}
      </div>
    </div>
  );
}
