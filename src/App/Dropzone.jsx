import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillCloseCircle } from 'react-icons/ai';

export default function MyDropzone({ className }) {
  const CLOUDINARY_UPLOAD_PRESET = 'waveirentease';
  const CLOUDINARY_API_URL = 'https://api.cloudinary.com/v1_1/dpiuoqcas';
  const [files, setFiles] = useState([]);
  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
        if (acceptedFiles?.length) {
          setFiles((prevFiles) => [
            ...prevFiles,
            ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
          ]);
        }
    } catch (error) {}

  
  }, []);

  const removePreview = (name) => {
    setFiles(files.filter((file) => file.name !== name));
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <section>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <h1 className="my-3 font-header  font-semibold text-primary">Upload files</h1>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : <p>Drag and drop some files here, or click to select files</p>}
      </div>
      <h1 className="my-3 font-header  font-semibold text-primary">Uploaded files</h1>
      <ul>
        {files.map((file) => (
          <li key={file.name} className=" flex space-x-2">
            <div className="relative">
              <button onClick={() => removePreview(file.name)}>
                <AiFillCloseCircle className="absolute  -right-2 top-1 text-xl text-red-500" />
              </button>
              <img
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={
                  // below is a best practice as it prevents memory leaks
                  URL.revokeObjectURL(file.preview)
                }
                className="relative rounded "
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
