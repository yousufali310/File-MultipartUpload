import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import UploadedFilesList from './components/UploadedFilesList';

interface UploadedFile {
  key: string;
  url: string;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get<UploadedFile[]>(
        'http://localhost:5000/api/files'
      );
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-lg">
        {/* Left: File Upload */}
        <div className="p-4 border-r border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 ">
            📤 Upload File
          </h2>
          <FileUpload onUploadSuccess={fetchFiles} />
        </div>

        {/* Right: Uploaded Files List */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            📂 Uploaded Files
          </h2>
          <UploadedFilesList files={files} />
        </div>
      </div>
    </div>
  );
};

export default App;
