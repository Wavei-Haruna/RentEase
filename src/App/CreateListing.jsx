import React, { useState, useEffect } from 'react';
import { MyDropzone, videoURL } from './Dropzone';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';

const ProgressBar = ({ progress }) => (
  <div className="progress-bar  z-50   w-full  bg-gray-200 h-4 rounded-lg overflow-hidden my-4">
    <div className="progress-bar-inner bg-blue-600 h-full" style={{ width: `${progress}%` }} />
    <span className="progress-text text-center block text-sm mt-2">{progress}%</span>
  </div>
);

export default function CreateListing() {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'sell',
    bedroom: 1,
    name: '',
    hall: '',
    description: '',
    Kitchen: false,
    toilet: false,
    bathroom: false,
    images: [],
    video: {},
    region: '',
    district: '',
    price: 1,
    town: '',
    section: '',
    landMark: '',
    location: '', // new location field
  });

  const {
    type,
    name,
    bedroom,
    bathroom,
    Kitchen,
    hall,
    images,
    price,
    description,
    toilet,
    region,
    district,
    section,
    landMark,
    town,
    location, // new location field
  } = formData;

  const [progress, setProgress] = useState(0);

  const calculateFormProgress = () => {
    const fields = [
      type,
      name,
      bedroom,
      hall,
      description,
      price,
      region,
      district,
      town,
      section,
      landMark,
    ];
    const filledFields = fields.filter((field) => field !== '' && field !== false);
    const totalFields = fields.length;
    const completion = Math.round((filledFields.length / totalFields) * 100);
    setProgress(completion);
  };

  useEffect(() => {
    calculateFormProgress();
  }, [formData]);

  const onChange = (e) => {
    e.preventDefault();
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Assuming you have a service to convert coordinates to URL
          const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          setFormData((prevState) => ({
            ...prevState,
            location: locationUrl,
          }));
        },
        (error) => {
          console.error(error);
          toast.error('Unable to retrieve your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };
  

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (images.length >= 6) {
      toast.error("can't upload more than 6 images");
      return;
    }

    const storeImages = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
            console.error(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all([...images].map((image) => storeImages(image))).catch((error) => {
      toast.error('Error uploading images');
      setLoading(false);
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      videoURL,
      timeStamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    if (docRef) {
      setLoading(false);
      toast.success('Listing created successfully');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="w-full mx-auto">
      <div className="max-w-2xl mx-auto my-12 p-6 border-2 border-primary bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6 font-header text-secondary border-b-2 py-2">Create Listing</h1>
        <ProgressBar progress={progress} />
        <form className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full" onSubmit={onSubmit}>
          <div className="flex flex-col col-span-2">
            <label className="floating-label font-body font-light">
              Sell or Rent
              <select
                id="type"
                onChange={onChange}
                value={type}
                className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
              >
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
              </select>
            </label>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="floating-label font-body font-light">
              Title
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                id="name"
                placeholder="e.g. Two bedroom apartment"
                required
                className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out "
              />
            </label>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="floating-label font-body font-light">
              Price
              <input
                type="number"
                name="price"
                value={price}
                onChange={onChange}
                id="price"
                placeholder="e.g. 1000 in cedis"
                required
                className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
              />
            </label>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="floating-label font-body font-light">
              Bedrooms
              <input
                type="number"
                name="bedroom"
                value={bedroom}
                onChange={onChange}
                id="bedroom"
                max={50}
                required
                className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
              />
            </label>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="floating-label font-body font-light">
              Hall
              <input
                type="number"
                name="hall"
                value={hall}
                onChange={onChange}
                id="hall"
                max={50}
                required
                className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
              />
            </label>
          </div>

          <div className=" flex">
            <label className="floating-label font-body font-light">
              Bathrooms
              <input
                type="number"
                name="bathroom"
                value={bathroom}
                onChange={onChange}
                id="bathroom"
                max={50}
                required
                className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
              />
            </label>
           
          </div>
          <div className="flex items-center justify-center">
        
        <label className="floating-label font-body flex items-center gap-2 ml-2 font-light">
          Kitchen
          <input
            type="checkbox"
            name="Kitchen"
            value={Kitchen}
            onChange={onChange}
            id="Kitchen"
            className="floating-checkbox"
          />
        </label>
        <label className="floating-label font-body font-light flex items-center gap-2 ml-2 ">
          Toilet
          <input
         type="checkbox"
         name="toilet"
         value={toilet}
         onChange={onChange}
         id="toilet"
         className="floating-checkbox"
       />
      </label>
      </div>

          

     
<div className="col-span-2 sm:col-span-1">
        <label className="floating-label font-body font-light">
          Region
          <input
            type="text"
            name="region"
            value={region}
            onChange={onChange}
            id="region"
            placeholder="Region"
            required
            className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
          />
        </label>
      </div>

      <div className="col-span-2 sm:col-span-1">
        <label className="floating-label font-body font-light">
          District
          <input
            type="text"
            name="district"
            value={district}
            onChange={onChange}
            id="district"
            placeholder="District"
            required
            className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
          />
        </label>
      </div>

      <div className="col-span-2 sm:col-span-1">
        <label className="floating-label font-body font-light">
          Town
          <input
            type="text"
            name="town"
            value={town}
            onChange={onChange}
            id="town"
            placeholder="Town"
            required
            className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
          />
        </label>
      </div>

      <div className="col-span-2 sm:col-span-1">
        <label className="floating-label font-body font-light">
          Section
          <input
            type="text"
            name="section"
            value={section}
            onChange={onChange}
            id="section"
            placeholder="Section"
            required
            className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
          />
        </label>
      </div>

      <div className="col-span-2 sm:col-span-1">
        <label className="floating-label font-body font-light">
          LandMark
          <input
            type="text"
            name="landMark"
            value={landMark}
            onChange={onChange}
            id="landMark"
            placeholder="LandMark"
            required
            className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
          />
        </label>
      </div>
      <div className="col-span-2">
        <label className="floating-label font-body font-light">
          Images
          <input
            type="file"
            name="images"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
          />
        </label>
      </div>
      <div className="col-span-2 mx-auto w-full">
        <label className="floating-label font-body font-light ">
          Description
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            id="description"
            placeholder="Description"
            required
            className="floating-textarea focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out"
          ></textarea>
        </label>
      </div>

      

      <div className="col-span-2">
        <MyDropzone />
      </div>

      <div className="col-span-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg"
        >
          Get Current Location
        </button>
        <input
          type="text"
          name="location"
          value={location}
          readOnly
          className="floating-input focus:outline-none focus:ring-primary focus:ring-[1px] transition-all ease-in-out mt-4"
          placeholder="Location will be auto-filled"
        />
      </div>

      <div className="col-span-2">
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition duration-200"
        >
          Submit Listing
        </button>
      </div>
    </form>
  </div>
</section>
);
}
