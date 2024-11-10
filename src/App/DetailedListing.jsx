import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { db } from '../firebase';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import SwiperCore from 'swiper';
import { doc, getDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getAuth } from 'firebase/auth';
import Spinner from './Spinner'; // Assuming you have a Spinner component
import { ActiveRouteProvider } from '../Components/Helpers/Context';
import Header from '../Components/Header';
import { MdKitchen, MdWater } from 'react-icons/md';
import { FaBed } from 'react-icons/fa';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const DetailedListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState([]);
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

  const fetchMessages = async () => {
    const messagesRef = collection(db, 'listings', id, 'messages');
    const messagesSnap = await getDocs(messagesRef);
    const messagesData = messagesSnap.docs.map((doc) => doc.data());
    setMessages(messagesData);
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  // const handleSendMessage = async () => {
  //   if (!auth.currentUser) {
  //     toast.error('You need to be logged in to send a message');
  //     return;
  //   }

  //   if (message.trim() === '') {
  //     toast.error('Message cannot be empty');
  //     return;
  //   }

  //   try {
  //     const messagesRef = collection(db, 'listings', id, 'messages');
  //     await addDoc(messagesRef, {
  //       message,
  //       userId: auth.currentUser.uid,
  //       createdAt: new Date(),
  //     });
  //     setMessage('');
  //     fetchMessages();
  //     toast.success('Message sent');
  //   } catch (error) {
  //     toast.error('Failed to send message');
  //   }
  // };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="detailed-listing container relative mx-auto my-12 rounded-lg bg-white p-6 shadow-lg">
      <ActiveRouteProvider>
        <Header />
      </ActiveRouteProvider>

      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="my-8 overflow-hidden rounded-xl"
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img src={url} alt={`Slide ${index}`} className="h-64 w-full object-cover md:h-[60vh]" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8 text-gray-700 ">
        <div>
          <div>
            <p className="font-body text-lg font-semibold capitalize text-primary ">{listing.name}</p>
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

        <div className="map my-6 ">
          <button
            onClick={() => window.open(listing.location, '_blank')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            View Location
          </button>
        </div>
        <div className="my-2">
          {' '}
          call us on <span className="font-semibold">0599655224 | 0500997536</span>
        </div>
        {/* 
        <div className="messages mb-6">
          <h2 className="mb-4 text-2xl font-semibold">Messages</h2>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="rounded-lg bg-gray-100 p-4 shadow">
                <p className="text-gray-800">{msg.message}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* <div className="message-input">
          <textarea
            className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows="4"
          />
          <button
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            onClick={handleSendMessage}
          >
            Send Message
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default DetailedListing;
