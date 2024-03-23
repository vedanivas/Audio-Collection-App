// DownloadForm.jsx
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';

function DownloadForm() {
  const [audioFiles, setAudioFiles] = useState([]);

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const fetchAudioFiles = () => {
    // Fetch audio files from the server
    fetch('YOUR_API_ENDPOINT_FOR_FETCHING_AUDIO_FILES')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch audio files');
        }
        return response.json();
      })
      .then(data => {
        setAudioFiles(data);
      })
      .catch(error => {
        console.error('Error fetching audio files:', error);
      });
  };

  const handleDownload = (filename) => {
    // Download the audio file
    fetch(`YOUR_API_ENDPOINT_FOR_DOWNLOADING_AUDIO_FILE?filename=${filename}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('Error downloading audio file:', error);
      });
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Downloadable Audio Files
      </Typography>
      <List>
        {audioFiles.map(file => (
          <ListItem key={file.filename}>
            <ListItemText primary={file.filename} />
            <Button variant="contained" color="primary" onClick={() => handleDownload(file.filename)}>
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default DownloadForm;
