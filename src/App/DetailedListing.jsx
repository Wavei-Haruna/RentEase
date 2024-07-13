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

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const DetailedListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
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
    const messagesData = messagesSnap.docs.map(doc => doc.data());
    setMessages(messagesData);
  };

  useEffect(() => {
    fetchMessages();
  }, [id]);

  const handleSendMessage = async () => {
    if (!auth.currentUser) {
      toast.error('You need to be logged in to send a message');
      return;
    }

    if (message.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      const messagesRef = collection(db, 'listings', id, 'messages');
      await addDoc(messagesRef, {
        message,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      setMessage('');
      fetchMessages();
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="detailed-listing container mx-auto relative my-12 p-6 bg-white shadow-lg rounded-lg">
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="rounded-xl overflow-hidden"
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img src={url} alt={`Slide ${index}`} className="w-full h-64 md:h-[60vh] object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-4">{listing.name}</h1>
        <p className="text-gray-700 mb-6">{listing.description}</p>

        <div className="map mb-6">
          <button
            onClick={() => window.open(listing.location, '_blank')}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            View Location
          </button>
        </div>

        <div className="messages mb-6">
          <h2 className="text-2xl font-semibold mb-4">Messages</h2>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                <p className="text-gray-800">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="message-input">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows="4"
          />
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={handleSendMessage}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedListing;
