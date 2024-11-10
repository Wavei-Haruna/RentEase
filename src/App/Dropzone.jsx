import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillCloseCircle } from 'react-icons/ai';
import DropFile from '../assets/Svgs/dropFIles.svg';

export function MyDropzone({ className, setVideoURL }) {
  const CLOUDINARY_UPLOAD_PRESET = 'waveirentease';
  const CLOUDINARY_API_URL = 'https://api.cloudinary.com/v1_1/dpiuoqcas/video/upload';
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const MAX_VIDEO_DURATION = 30;

  // dropzone function to accepted files
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const videoFile = acceptedFiles[0];

      if (videoFile.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(videoFile);

        video.onloadedmetadata = async () => {
          const duration = Math.floor(video.duration);
          if (duration <= MAX_VIDEO_DURATION) {
            console.log(acceptedFiles);

            const formData = new FormData();
            formData.append('file', acceptedFiles[0]);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            setUploading(true);
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

              const uploadedFile = response.data;
              setVideoURL(uploadedFile.url); // Set the video URL in the parent component

              setFiles((prevFiles) => [
                ...prevFiles,
                ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
              ]);
              console.log(uploadedFile);
            } catch (error) {
              setError('Upload failed. Please try again.');
              console.error(error);
            } finally {
              setUploading(false);
            }
          } else {
            setError('Video is too long. Maximum duration is 30 seconds.');
          }
        };
      } else {
        setError('Only video files are allowed.');
      }
    },
    [setVideoURL],
  );

  const removePreview = (name) => {
    setFiles(files.filter((file) => file.name !== name));
  };

  // useDropzone hook accepting video files
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'video/*' });

  return (
    <section>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <h1 className="my-3 font-header font-semibold text-primary">Upload files</h1>
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

      {error && <p className="text-red-500">{error}</p>}

      <h1 className="my-3 font-header font-semibold text-primary">Uploaded files</h1>
      <ul>
        {files.map((file) => (
          <li key={file.name} className="flex space-x-2">
            <div className="relative">
              <button onClick={() => removePreview(file.name)}>
                <AiFillCloseCircle className="absolute -right-2 top-1 text-xl text-red-500" />
              </button>
              <img
                src={file.preview}
                alt={file.name}
                width={100}
                height={100}
                onLoad={() => URL.revokeObjectURL(file.preview)} // Correctly revoke the object URL
                className="relative rounded"
              />
            </div>
          </li>
        ))}
      </ul>

      {uploading && <p>Uploading...</p>}
    </section>
  );
}
