import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import Link from "@mui/material/Link";

const styles = {
  root: {
    textAlign: 'center',
    paddingTop: '80px',
  },
  heading: {
    marginBottom: '40px', 
    fontWeight: 'bold',
    fontSize: '2rem',
    color: '#333', 
  },
  description: {
    marginBottom: '20px', 
    fontSize: '1.2rem',
    color: '#666', 
  },
  button: {
    padding: '10px 30px', 
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#fff', 
    backgroundColor: '#007bff', 
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', 
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

function HomePage() {
  return (
    <Container maxWidth="sm" style={styles.root}>
      <Typography variant="h4" style={styles.heading}>
        Welcome to Audio Collection Application
      </Typography>
      <Typography variant="body1" style={styles.description}>
        Start managing your audio collection effortlessly.
      </Typography>
      <Button
        variant="contained"
        href="/login"
        style={styles.button}
        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        Let's get started
      </Button>
    </Container>
  );
}

export default HomePage;
