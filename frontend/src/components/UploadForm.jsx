import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5050/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file.');
      }

      // Handle success
      console.log('File uploaded successfully.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setErrorMessage('Error uploading file. Please try again.');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide the default input style
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input">
        <Button component="span" variant="outlined" color="primary">
          Choose File
        </Button>
      </label>
      <Typography variant="body2" color="error" style={{ marginTop: '0.5rem' }}>
        {errorMessage}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '1rem' }}
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </Button>
    </div>
  );
}

export default UploadForm;
