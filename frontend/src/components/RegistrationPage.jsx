import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar, Button, CssBaseline, TextField, FormControlLabel,FormControl,
  Link, Grid, Box, Typography, Container, Alert,
  Select, MenuItem, InputLabel, Radio, RadioGroup, ThemeProvider
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme } from "@mui/material/styles";
import { useAuth } from "../contexts/AuthContext";
import url from "../url";

const defaultTheme = createTheme();

const ROOT = url();

export default function SignUp() {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useAuth();
  const [formData, setFormData] = useState({
    phone_number: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
    fname: "",
    lname: "",
    gender: "",
    role: "user",
  });
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      if (userRole === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  }, [isLoggedIn, userRole, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessages(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'phone_number':
        return /^\d{10}$/.test(value) ? "" : "Phone number must be 10 digits.";
      case 'email':
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? "" : "Invalid email format.";
      case 'age':
        const age = parseInt(value, 10);
        return age >= 8 && age <= 100 ? "" : "Age must be between 8 and 100.";
      case 'password':
        const passwordError = value.length >= 6 ? "" : "Password must be at least 6 characters long.";
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setErrorMessages(prev => ({ ...prev, confirmPassword: "Passwords do not match." }));
        }
        return passwordError;
      case 'confirmPassword':
        return value === formData.password ? "" : "Passwords do not match.";
      default:
        return "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (Object.values(formData).every(value => value) && Object.values(errorMessages).every(msg => !msg)) {
        try {
            const response = await fetch(`${ROOT}users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, admin: formData.role === "admin" }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            navigate("/login");
        } catch (error) {
            setErrorMessages(prev => ({ ...prev, form: error.message }));
        }
    } else {
        setErrorMessages(prev => ({ ...prev, form: "Please check your input." }));
    }
};


  const isFormValid = Object.values(formData).every(value => value) &&
                      Object.values(errorMessages).every(msg => !msg);


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Sign Up</Typography>
          {errorMessages.form && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {errorMessages.form}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="phone_number"
                    label="Phone Number"
                    name="phone_number"
                    autoComplete="tel"
                    value={formData.phone_number}
                    onChange={handleChange}
                    error={!!errorMessages.phone_number}
                    helperText={errorMessages.phone_number} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errorMessages.email}
                    helperText={errorMessages.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="age"
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    error={!!errorMessages.age}
                    helperText={errorMessages.age}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errorMessages.password}
                    helperText={errorMessages.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errorMessages.confirmPassword}
                    helperText={errorMessages.confirmPassword}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="fname"
                    label="First Name"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lname"
                    label="Last Name"
                    name="lname"
                    value={formData.lname}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="user"
                        control={<Radio />}
                        label="User"
                      />
                      <FormControlLabel
                        value="admin"
                        control={<Radio />}
                        label="Admin"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                      labelId="gender-select-label"
                      id="gender"
                      name="gender"
                      required
                      label="Gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFormValid}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}