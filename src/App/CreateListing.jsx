import React, { useState } from 'react';
import { MyDropzone, videoURL } from './Dropzone';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';

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
  } = formData;

  // the onChnage function
  const onChange = (e) => {
    e.preventDefault();
    console.log(type);
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }
    // if it is a file
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // if text or an Image
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  //  form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    if (images.length >= 6) {
      toast.error("can't upload more than 6 images");
    }

    const storeImages = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        // creating a dynamic imageurl
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        //
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case 'pause':
                console.log('state is paused');
                break;
              case 'running':
                console.log('uploading');
                break;
              case 'success':
                console.log('done');
            }
          },
          (error) => {
            reject(error);
            console.log(error);
          },

          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          },
        );
      });
    };
    // getting the images from the store images array and mapping them into the store images array.
    const imgUrls = await Promise.all([...images].map((image) => storeImages(image))).catch((error) => {
      toast.error('oops error uploading images');
    });

    // creating a copy of the formData
    const formDataCopy = {
      ...formData,
      imgUrls,
      videoURL,
      timeStamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    docRef && setLoading(false);
    toast.success('listings created');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="  z-50 w-screen bg-black">
      <div className="absolute  left-1/3 mx-auto my-3 max-w-md  rounded-xl border-2  border-b-primary  border-t-primary bg-gray-200 p-2">
        <h1 className="m-2 p-2 text-center font-menu text-xl">Create Listing</h1>

        <form className="font-menu" onSubmit={onSubmit}>
          <p className=" p-2 font-body font-semibold text-text underline">Sell or Rent</p>

          <div className="flex space-x-10 font-menu">
            <button
              id="type"
              type="button"
              onClick={onChange}
              value="sell"
              className={`w-full rounded px-7 py-3 text-sm uppercase shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                type === 'sell' ? 'bg-slate-500 text-white' : 'bg-white'
              }`}
            >
              Sell
            </button>
            <button
              id="type"
              type="button"
              onClick={onChange}
              value="rent"
              className={`w-full rounded px-7 py-3  text-sm uppercase shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                type === 'rent' ? 'bg-slate-500 text-white' : 'bg-white'
              }`}
            >
              Rent
            </button>
          </div>

          <div className="my-3 ">
            <p> Title:</p>

            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              id="name"
              placeholder=" e.g two bed room apartment"
              required
              className="w-full border-b border-secondary bg-white px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
            />
          </div>

          <div className="my-3 ">
            <p> Price:</p>

            <input
              type="Number"
              name="price"
              value={price}
              onChange={onChange}
              id="price"
              placeholder="1,000 in cedis"
              required
              className="w-full border-b border-secondary bg-white  px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
            />
          </div>
          <div className="space-between my-3 flex space-x-10 ">
            <div>
              <p>Bedrooms</p>

              <input
                type="number"
                name="bedroom"
                value={bedroom}
                onChange={onChange}
                id="bedroom"
                max={50}
                required
                className="w-full border-b border-secondary bg-white  px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <p>Hall</p>

              <input
                type="number"
                name="hall"
                value={hall}
                onChange={onChange}
                id="hall"
                max={50}
                required
                className="w-full border-b border-secondary bg-white px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="my-3 ">
            <p>Description:</p>

            <textarea
              type="text"
              name="name"
              value={description}
              onChange={onChange}
              id="description"
              required
              className="w-full border-b border-secondary bg-white px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
            />
          </div>
          <p>Bathroom</p>
          <div className="flex space-x-10 font-menu">
            <button
              id="bathroom"
              type="button"
              onClick={onChange}
              value={'true'}
              className={`w-full rounded px-7 py-3 text-sm uppercase shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                bathroom ? 'bg-slate-500 text-white' : 'bg-white'
              }`}
            >
              yes
            </button>
            <button
              id="bathroom"
              type="button"
              onClick={onChange}
              value={'false'}
              className={`w-full rounded px-7 py-3  text-sm uppercase shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                !bathroom ? 'bg-slate-500 text-white' : 'bg-white'
              }`}
            >
              No
            </button>
          </div>

          <p className="my-3">Toilet</p>
          <div className="flex space-x-10 font-menu">
            <button
              id="toilet"
              type="button"
              onClick={onChange}
              value={'true'}
              className={`w-full rounded px-7 py-3 text-sm uppercase shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                toilet ? 'bg-slate-500 text-white' : 'bg-white'
              }`}
            >
              yes
            </button>
            <button
              id="toilet"
              type="button"
              onClick={onChange}
              value={'false'}
              className={`w-full rounded px-7 py-3  text-sm uppercase shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                !toilet ? 'bg-slate-500 text-white' : 'bg-white'
              }`}
            >
              No
            </button>
          </div>
          <p className="my-3">Kitchen</p>
          <div className="flex space-x-10 font-menu">
            <button
              id="Kitchen"
              type="button"
              onClick={onChange}
              value={'true'}
              className={`w-full rounded px-7 py-3 text-sm uppercase shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                Kitchen ? 'bg-slate-500 text-white' : 'bg-white'
              }`}
            >
              yes
            </button>
            <button
              id="Kitchen"
              type="button"
              onClick={onChange}
              value={'false'}
              className={`w-full rounded px-7 py-3  text-sm uppercase shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:shadow-lg active:shadow-lg ${
                !Kitchen ? 'bg-slate-500 text-white' : 'bg-white'
              }`}
            >
              No
            </button>
          </div>
          <div className="my-3 ">
            <p>Region:</p>

            <input
              type="text"
              name="region"
              value={region}
              onChange={onChange}
              id="region"
              placeholder="e.g Greater Accra"
              required
              className="w-full border-b border-secondary bg-white px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
            />
          </div>
          <div className="my-3 ">
            <p>District:</p>

            <input
              id="district"
              type="text"
              name="district"
              value={district}
              onChange={onChange}
              placeholder="e.g Ashaiman"
              required
              className="w-full border-b border-secondary bg-white px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
            />
          </div>
          <div className="my-3 ">
            <p>Town:</p>

            <input
              type="text"
              name="region"
              value={town}
              onChange={onChange}
              id="town"
              placeholder="e.g Ashaiman"
              required
              className="w-full border-b border-secondary bg-white px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
            />
          </div>
          <div className="my-3 ">
            <p>Section:</p>

            <input
              type="text"
              name="section"
              value={section}
              onChange={onChange}
              id="section"
              placeholder="e.g Ashaiman Quaters"
              required
              className="w-full border-b border-secondary bg-white px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
            />
          </div>
          <div className="my-3 ">
            <p>Landmark:</p>

            <input
              type="text"
              name="region"
              value={landMark}
              onChange={onChange}
              id="landMark"
              placeholder="e.g opposite police Station"
              required
              className="w-full border-b border-secondary bg-white px-3 py-1 text-text transition-all duration-200 ease-out focus:border-primary focus:outline-none"
            />
          </div>
          <div className="my-3">
            <label htmlFor="images">Images: Max 6</label>
            <input
              type="file"
              accept="image/*"
              name="images"
              onChange={onChange}
              id="images"
              multiple
              required
              className="w-full py-1 text-text"
            />
          </div>

          {/* <div className="my-3">
          <label htmlFor="video">Video (Max 30s):</label>
          <input
            type="file"
            accept="video/*"
            name="video"
            onChange={onChange}
            id="video"
            value={video}
            required
            className="w-full py-1 text-text"
          />
        </div> */}
          <MyDropzone className={`my-3 cursor-pointer rounded  border border-text p-3`} />

          <button className="w-full rounded bg-primary p-3 text-center font-semibold text-white"> Submit</button>
        </form>
      </div>
    </section>
  );
}
