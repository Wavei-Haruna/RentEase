import React, {useState} from 'react'
import CreateListing from './CreateListing'
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';



export default function EditListing({ listing, onClose, onSave }) {
   
        const [formData, setFormData] = useState(listing);
      
        const onChange = (e) => {
          e.preventDefault();
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
      
        const onSubmit = async (e) => {
            e.preventDefault();
            try {
              const docRef = doc(db, 'listings', listing.id); // replace 'listings' with the name of your Firestore collection
              await updateDoc(docRef, formData);
              onSave();
            } catch (error) {
              console.error(error);
              toast.error('Error updating listing');
            }
        };
      
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto h-screen" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center  pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left h-fit shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                
                  <CreateListing formDataProp={formData} onChangeProp={onChange} onSubmitProp={onSubmit} />
                </div>
              
            </div>
          </div>
        );
      }

