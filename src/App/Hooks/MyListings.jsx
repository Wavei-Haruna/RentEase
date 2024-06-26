import React, { useState } from 'react';
import { FaHome, FaPlus, FaChartBar, FaDollarSign, FaMoneyBill } from 'react-icons/fa';
import GetListings from '../GetListings';
import CreateListing from '../CreateListing';
import { FaSellsy } from 'react-icons/fa6';

export default function MyListings() {
  const [fetchedListingsData, setFetchedListingsData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const onListingsDataFetched = (data) => {
    setFetchedListingsData(data);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pt-6">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-header text-primary">My Listings</h2>
       
      </header>

      <div className=" md:flex justify-between items-center ">
         <button
          className="bg-secondary font-menu flex justify-center items-center hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating? 'Close' : 'Add New Listing'}
          <FaPlus className="ml-2" />
        </button>
        <div className="w-full md:w-1/2 font-semibold">
          <div className="bg-white  shadow-md p-4 rounded">
            <h3 className="text-lg font-bold my-3 font-header text-primary">Listing Statistics</h3>
            {fetchedListingsData && (
              <ul className='flex gap-5 font-body'>
                <li className=' flex items-center  gap-2'>
                  <FaChartBar className="mr-2 text-secondary text-xl" />
                  Total Listings: {fetchedListingsData.totalListings}
                </li>
                <li className=' flex items-center  gap-2'>
                  <FaDollarSign className="mr-2 text-secondary text-xl" />
                  For Sale: {fetchedListingsData.listingsForSale}
                </li>
                <li className=' flex items-center  gap-2'>
                  <FaMoneyBill className="mr-2 text-secondary text-xl" />
                  Total Rent: {fetchedListingsData.listingsForRent}
                </li>
                {/* <li className=' flex items-center  gap-2'>
                  <FaChartBar className="mr-2 text-secondary text-xl" />
                  Sold Listings: {fetchedListingsData.soldListings}
                </li>
                <li className=' flex items-center  gap-2'>
                  <FaChartBar className="mr-2 text-secondary text-xl" />
                  Rented Listings: {fetchedListingsData.rentedListings}
                </li> */}
              </ul>
            )}
          </div>
        </div>

        
      </div>
      <div className="w-full  p-4">
          {isCreating? (
            <CreateListing />
          ) : (
            <GetListings onListingsDataFetched={onListingsDataFetched} />
          )}
        </div>
    </div>
  );
}