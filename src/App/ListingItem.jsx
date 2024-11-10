import moment from 'moment';
import React, { useState } from 'react';
import { MdKitchen, MdLocationOn, MdEdit, MdDelete, MdWater } from 'react-icons/md';
import { FaBed, FaHome, FaBath } from 'react-icons/fa';
import { useNavigate } from 'react-router';

export default function ListingItem({ listing, id, onDelete }) {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  const date = moment(listing?.timeStamp?.seconds * 1000);

  return (
    <div className=" w-full space-y-4 rounded-lg p-2 font-body shadow-lg">
      <div className="relative h-64 w-full">
        <img
          src={listing.imgUrls[0]}
          alt=""
          className="h-full w-full cursor-pointer rounded-lg object-cover transition-all duration-150 hover:scale-105"
          onClick={() => navigate(`/listing/${id}`)}
        />
        <div className="absolute bottom-4 right-4 flex space-x-3">
          <button
            className="rounded bg-red-600 p-1.5 font-medium text-white hover:bg-red-800"
            onClick={() => onDelete(id)}
          >
            <MdDelete size={18} />
          </button>
          <label className="inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" checked={checked} onChange={handleChange} />
            <div className="relative h-5 w-10 rounded-full bg-gray-300 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-full"></div>
            <span className="ml-2 text-sm font-semibold">{listing.type === 'rent' ? 'Rented' : 'Sold'}</span>
          </label>
        </div>
        <div className="absolute left-2 top-1 flex items-center rounded-md bg-gray-800 bg-opacity-70 p-1">
          <MdLocationOn className="mr-1 text-white" size={16} />
          <p className="text-xs font-medium capitalize text-white">{listing.town}</p>
        </div>
        <p className="absolute right-2 top-1 rounded-md bg-gray-800 bg-opacity-70 p-1 text-xs text-white">
          {date.fromNow()}
        </p>
        <div className="absolute bottom-1 left-2 rounded-md bg-gray-800 bg-opacity-70 p-1 text-xs text-white">
          {listing.type === 'sell' ? `For Sale: GH₵ ${listing.price}` : `For Rent: GH₵ ${listing.price}`}
        </div>
      </div>

      <div>
        <p className="font-body text-lg font-semibold capitalize text-primary">{listing.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="flex items-center font-medium text-secondary">
              <MdKitchen size={18} className="mr-1  text-yellow-600" />
              Kitchen: {listing.kitchen ? 'Yes' : 'No'}
            </p>
            <p className="flex items-center text-secondary ">
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
    </div>
  );
}
