import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Button } from '@mui/material';
import AudioRecorder from './AudioRecorder'; 

function UserDashboard() {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = () => {
    fetch('http://localhost:5050/api/sentences')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch sentences');
        }
        return response.json();
      })
      .then(data => {
        setSentences(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sentences:', error);
        setError('Failed to fetch sentences. Please try again later.');
        setLoading(false);
      });
  };

  const handleNextSentence = () => {
    setCurrentSentenceIndex(prevIndex => prevIndex + 1);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="body1">{error}</Typography>;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h5">Sentence to Record</Typography>
      {sentences.length > 0 ? (
        <div>
          <Typography variant="body1" style={{ marginTop: '1rem' }}>
            {sentences[currentSentenceIndex].sentence}
          </Typography>
          <AudioRecorder />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
            onClick={handleNextSentence}
            disabled={currentSentenceIndex === sentences.length - 1}
          >
            Next Sentence
          </Button>
        </div>
      ) : (
        <Typography variant="body1">No sentences to display.</Typography>
      )}
    </div>
  );
}

export default UserDashboard;
