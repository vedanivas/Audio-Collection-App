import React from 'react';
import UploadForm from './UploadForm';
import DownloadForm from './DownloadForm';
import { Typography, Paper } from '@mui/material';

function AdminDashboard() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Admin Dashboard
      </Typography>
      <Paper elevation={3} style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
        <UploadForm />
      </Paper>
      <Paper elevation={3} style={{ padding: '2rem', maxWidth: '400px', margin: '2rem auto' }}>
        <DownloadForm />
      </Paper>
    </div>
  );
}

export default AdminDashboard;
