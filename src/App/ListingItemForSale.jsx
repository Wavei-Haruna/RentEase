import React from 'react';
import moment from 'moment';
import { MdKitchen, MdLocationOn, MdWater } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';
import { AiFillEye, AiFillPhone } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation

export default function ListingItemForSale({ listing, id, viewCount }) {
  const navigate = useNavigate(); // Hook for navigation
  const date = moment(listing?.timeStamp?.seconds * 1000);

  const handleClick = () => {
    navigate(`/listing/${id}`); // Navigate to the detailed listing URL
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow-md transition-all duration-200 ease-in-out hover:scale-105">
      {/* Image Section */}
      <div className="relative h-64 w-full">
        <img
          src={listing.imgUrls[0]}
          alt=""
          className="h-full w-full cursor-pointer rounded-lg object-cover transition-all duration-150 ease-in hover:scale-105"
          onClick={handleClick} // Click handler for navigation
        />

        {/* Location and Timestamp */}
        <div className="absolute left-2 top-1 flex items-center justify-center rounded-br-md rounded-tl-md bg-black bg-opacity-60 p-2">
          <MdLocationOn className="mr-1 text-white" size={20} />
          <p className="text-sm font-semibold capitalize text-white">{listing.town}</p>
        </div>
        <p className="absolute right-2 top-1 rounded-br-md rounded-tl-md bg-black bg-opacity-60 p-2 text-xs text-white">
          {date.fromNow()}
        </p>

        {/* Price Info */}
        <div className="absolute bottom-1 left-2 rounded-br-md rounded-tl-md bg-black bg-opacity-60 p-2 text-xs font-semibold text-white">
          {listing.type === 'sell' ? <p>For Sale : GHs {listing.price}</p> : <p>For Rent : GHs {listing.price}</p>}
        </div>

        {/* View Count */}
        <div className="absolute bottom-1 right-2 flex hidden items-center rounded-br-md rounded-tl-md bg-black bg-opacity-60 p-2 text-xs text-white">
          <AiFillEye className="mx-3" /> {viewCount || 0}
        </div>
      </div>

      {/* Listing Details */}
      <div>
        <p className="font-body text-lg font-semibold capitalize text-primary">{listing.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="flex items-center font-medium text-secondary">
              <MdKitchen size={18} className="mr-1 text-yellow-600" />
              Kitchen: {listing.kitchen ? 'Yes' : 'No'}
            </p>
            <p className="flex items-center text-secondary">
              <MdWater size={18} className="mr-1 text-blue-300" />
              Bathroom: {listing.bathroom ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4 text-secondary">
          <p className="flex items-center">
            <FaBed size={18} className="mr-1" />
            Bedroom: {listing.bedroom}
          </p>
          <p>Toilet: {listing.toilet ? 'Yes' : 'No'}</p>
        </div>
        <p className="mt-2 text-gray-600">{listing.description}</p>
      </div>

      {/* Contact and Social Share */}
      <div className="mt-6 flex w-full justify-between gap-2">
        <button
          onClick={() => handleClick(id)}
          className="mt-2 rounded-lg bg-blue-500 p-2 text-white transition-all duration-200 ease-in-out hover:scale-105"
        >
          View Details
        </button>
        <div className="my-2 flex items-center gap-x-2">
          <AiFillPhone />
          <span className="">0599655224</span>
        </div>
      </div>
    </div>
  );
}
