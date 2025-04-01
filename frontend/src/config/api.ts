import axios from 'axios';

export const uploadFile = async (file: File, onUploadProgress: (progressEvent: ProgressEvent) => void) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post('http://localhost:5000/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};
