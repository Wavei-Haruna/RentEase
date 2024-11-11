import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { db } from '../firebase';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import SwiperCore from 'swiper';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import Spinner from './Spinner';
import { ActiveRouteProvider } from '../Components/Helpers/Context';
import Header from '../Components/Header';
import { MdKitchen, MdWater, MdLocationOn } from 'react-icons/md';
import { FaBed, FaShower, FaDollarSign } from 'react-icons/fa';
import { GiHouseKeys } from 'react-icons/gi';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const DetailedListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      } else {
        toast.error('Listing not found');
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="detailed-listing container mx-auto my-16 max-w-screen-lg rounded-xl bg-white p-6 shadow-lg">
      <ActiveRouteProvider>
        <Header />
      </ActiveRouteProvider>

      {/* Swiper Carousel for Images */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="my-8 overflow-hidden rounded-lg shadow-lg"
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={url}
              alt={`Slide ${index}`}
              className="h-[60vh] w-full rounded-md object-cover transition-transform duration-300 hover:scale-105"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Listing Details */}
      <div className="listing-details mt-8 space-y-6 text-gray-700">
        <h1 className="text-3xl font-semibold capitalize text-primary">{listing.name}</h1>

        {/* Property Overview */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-lg text-secondary">
          <div className="flex items-center space-x-2">
            <FaDollarSign size={20} className="text-green-500" />
            <span className="font-semibold">{listing.price} GHS</span>
          </div>

          <div className="flex items-center space-x-2">
            <MdLocationOn size={20} className="text-red-500" />
            <span>{listing.region}</span>
          </div>

          <div className="flex items-center space-x-2">
            <GiHouseKeys size={20} className="text-blue-500" />
            <span>{listing.propertyType}</span>
          </div>
        </div>

        {/* Detailed Features */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-lg text-secondary">
          <div className="flex items-center space-x-2">
            <FaBed size={20} className="text-gray-700" />
            <span>
              {listing.bedroom} Bedroom{listing.bedroom > 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <FaShower size={20} className="text-blue-300" />
            <span>{listing.bathroom ? 'Bathroom' : 'No Bathroom'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MdKitchen size={20} className="text-yellow-600" />
            <span>{listing.kitchen ? 'Kitchen Available' : 'No Kitchen'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MdWater size={20} className="text-teal-400" />
            <span>{listing.toilet ? 'Toilet Available' : 'No Toilet'}</span>
          </div>
        </div>

        {/* Listing Description */}
        <div className="mt-6">
          <p className="text-lg text-gray-600">{listing.description}</p>
        </div>

        {/* Location Button */}
        <div className="mt-6">
          <button
            onClick={() => window.open(listing.location, '_blank')}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700"
          >
            View Location
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-6 text-lg">
          <p>
            Contact us at <span className="font-semibold text-primary">0599655224 | 0500997536</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedListing;
