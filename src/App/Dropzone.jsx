import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillCloseCircle } from 'react-icons/ai';
import DropFile from '../assets/Svgs/dropFIles.svg';

export let videoURL = '';
const MAX_VIDEO_DURATION = 30;

export function MyDropzone({ className }) {
  const CLOUDINARY_UPLOAD_PRESET = 'waveirentease';
  const CLOUDINARY_API_URL = 'https://api.cloudinary.com/v1_1/dpiuoqcas/video/upload';
  const [files, setFiles] = useState([]);
  // dropzone function to accepted files
  const onDrop = useCallback(async (acceptedFiles) => {
    const videoFile = acceptedFiles[0];

    if (videoFile.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      video.onloadeddata = async () => {
        const duration = Math.floor(video.duration);
        if (duration <= MAX_VIDEO_DURATION) {
          console.log(acceptedFiles);
          const formData = new FormData();
          formData.append('file', acceptedFiles[0]);
          formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          try {
            const response = await axios.post(CLOUDINARY_API_URL, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              onUploadProgress: (ProgressEvent) => {
                const progress = (ProgressEvent.loaded / ProgressEvent.total) * 100;
                console.log(`Upload Progress: ${progress}%`);
              },
            });

            if (acceptedFiles?.length) {
              const uploadedFile = response.data;
              videoURL = uploadedFile.url;
              console.log(uploadedFile);

              setFiles((prevFiles) => [
                ...prevFiles,
                ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
              ]);
            }
          } catch (error) {
            console.log(error);
          }
        }
      };
    }
  }, []);

  const removePreview = (name) => {
    setFiles(files.filter((file) => file.name !== name));
  };

  //  useDropezone hook accepting video files
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'video/*' });

  return (
    <section>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <h1 className="my-3 font-header  font-semibold text-primary">Upload files</h1>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="relative">
            <p className="absolute left-1/4 top-4 text-center">drag and drop files here</p>

            <img src={DropFile} alt="drop file" className="mx-auto h-1/2 w-1/2" />
          </div>
        )}
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
