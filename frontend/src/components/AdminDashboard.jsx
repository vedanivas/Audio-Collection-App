import React from 'react';
import UploadForm from "./UploadForm";
import DownloadForm from "./DownloadForm";
import { Typography, Paper, AppBar, Toolbar, IconButton, Container, Grid } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

function AdminDashboard() {
  const { logout } = useAuth();

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Welcome to the Admin Dashboard
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upload Data
              </Typography>
              <UploadForm />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Download Data
              </Typography>
              <DownloadForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default AdminDashboard;
