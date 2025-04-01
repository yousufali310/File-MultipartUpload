import React, { useState } from 'react';
import { uploadFile } from '../config/api';
interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setProgress(0);
    setMessage('Uploading...');
    setIsUploading(true);

    try {
      await uploadFile(selectedFile, (uploadEvent) => {
        setProgress(Math.round((100 * uploadEvent.loaded) / uploadEvent.total));
      });

      setMessage('✅ Upload successful!');

      setTimeout(() => {
        setMessage('');
        setProgress(0);
        setIsUploading(false);
        onUploadSuccess();
      }, 2000);
    } catch (error) {
      setMessage('❌ Upload failed!');
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-700 text-center mb-4">
        📤 Upload a File
      </h2>

      <label
        className={`flex flex-col items-center justify-center w-full h-40 border-2 ${
          isUploading ? 'border-green-500' : 'border-gray-300'
        } border-dashed bg-gray-50 rounded-lg cursor-pointer hover:border-blue-500 transition`}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <div className="flex flex-col items-center">
          <svg
            className={`w-10 h-10 ${
              isUploading ? 'text-green-500' : 'text-gray-500'
            } mb-2 transition`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16V9a4 4 0 118 0v7m5 0a2 2 0 01-2 2H6a2 2 0 01-2-2m5 0h6"
            ></path>
          </svg>
          <p className="text-gray-600 text-sm">
            {isUploading ? 'Uploading...' : 'Drag & Drop or Click to Upload'}
          </p>
        </div>
      </label>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-center">{progress}%</p>
        </div>
      )}

      {/* Message */}
      {message && <p className="mt-3 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default FileUpload;
