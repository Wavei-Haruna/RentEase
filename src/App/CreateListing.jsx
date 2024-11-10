import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';
import districts from '../Components/Districts';

const ProgressBar = ({ progress }) => (
  <div className="progress-bar  z-50   my-4  h-4 w-full overflow-hidden rounded-lg bg-gray-200">
    <div className="progress-bar-inner h-full bg-blue-600" style={{ width: `${progress}%` }} />
    <span className="progress-text mt-2 block text-center text-sm">{progress}%</span>
  </div>
);

export default function CreateListing() {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [videoURL, setVideoURL] = useState('');

  const [formData, setFormData] = useState({
    type: 'sell',
    bedroom: 1,
    name: '',
    description: '',
    numberOfPeople: 1, // New field for number of people

    Kitchen: false,
    toilet: false,
    bathroom: false,
    images: [],
    video: {},
    region: '',
    district: '',
    price: 1,
    town: '',
    priceFrequency: 'Year', // Default to month
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
    numberOfPeople,
    priceFrequency,
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
      numberOfPeople,
      hall,
      description,
      price,
      priceFrequency,
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
    } else {
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
        },
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
          },
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
    <section className="mx-auto w-full">
      <div className="mx-auto my-12 max-w-2xl  rounded-lg border-2 border-primary bg-white p-6 font-body text-gray-700 shadow-lg">
        <h1 className="mb-6 border-b-2 py-2 text-center font-header text-2xl font-bold text-secondary">
          Create Listing
        </h1>
        <ProgressBar progress={progress} />
        <form className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3" onSubmit={onSubmit}>
          <div className="col-span-2 flex flex-col">
            <label className="floating-label font-body font-light">
              SelL, Rent Or Hostel
              <select
                id="type"
                onChange={onChange}
                value={type}
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
              >
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
                <option value="hostel">Hostel</option>
              </select>
            </label>
          </div>
          {/* Conditionally render the Number of People field */}
          {type === 'hostel' && (
            <div className="col-span-2 sm:col-span-1">
              <label className="floating-label font-body font-light">
                Number of People in Room
                <input
                  type="number"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={onChange}
                  id="numberOfPeople"
                  min={1}
                  required
                  className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
                />
              </label>
            </div>
          )}

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
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary "
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
                onChange={onChange} // Existing handler
                id="price"
                placeholder="e.g. 1000 in cedis"
                required
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
              />
            </label>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="floating-label font-body font-light">
              Price Frequency
              <select
                id="priceFrequency"
                onChange={onChange} // Existing handler
                value={priceFrequency}
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
              >
                <option value="month">Per Month</option>
                <option value="year">Per Year</option>
              </select>
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
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
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
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
              />
            </label>
          </div>
          <div className="flex items-center justify-center">
            <label className="floating-label ml-2 flex items-center gap-2 font-body font-light">
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
            <label className="floating-label ml-2 flex items-center gap-2 font-body font-light ">
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
              <select
                name="region"
                value={region}
                onChange={onChange}
                id="region"
                required
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
              >
                <option value="" disabled>
                  Select Region
                </option>
                <option value="Ashanti">Ashanti</option>
                <option value="Greater Accra">Greater Accra</option>
              </select>
            </label>
          </div>

          {/* Conditionally render the District select */}
          {region && (
            <div className="col-span-2 sm:col-span-1">
              <label className="floating-label font-body font-light">
                District
                <select
                  name="district"
                  value={district}
                  onChange={onChange}
                  id="district"
                  required
                  className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
                >
                  <option value="" disabled>
                    Select District
                  </option>
                  {region === 'Ashanti' &&
                    districts.ashantiRegion.map((districtName, index) => (
                      <option key={index} value={districtName}>
                        {districtName}
                      </option>
                    ))}
                  {region === 'Greater Accra' &&
                    districts.greaterAccraRegion.map((districtName, index) => (
                      <option key={index} value={districtName}>
                        {districtName}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          )}

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
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
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
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
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
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
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
                className="floating-input transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
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
                className="floating-textarea transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
              ></textarea>
            </label>
          </div>

          <div className="col-span-2">
            <button type="button" onClick={getCurrentLocation} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              Get Current Location
            </button>
            <input
              type="text"
              name="location"
              value={location}
              readOnly
              className="floating-input mt-4 transition-all ease-in-out focus:outline-none focus:ring-[1px] focus:ring-primary"
              placeholder="Location will be auto-filled"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="hover:bg-primary-dark w-full rounded-lg bg-primary px-6 py-3 text-white transition duration-200"
            >
              Submit Listing
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
