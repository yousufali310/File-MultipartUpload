import React from 'react';

interface UploadedFile {
  key: string;
  url: string;
}

interface UploadedFilesListProps {
  files: UploadedFile[];
}

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({ files }) => {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-700 text-center mb-4">
        📂 Uploaded Files
      </h2>

      {files.length === 0 ? (
        <p className="text-gray-500 text-center">No files uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition"
            >
              <span className="text-gray-700 truncate">{file.key}</span>

              {/* Download Button */}
              <a
                href={file.url}
                download
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                title="Download"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v12m0 0l4-4m-4 4l-4-4M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"
                  ></path>
                </svg>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadedFilesList;
