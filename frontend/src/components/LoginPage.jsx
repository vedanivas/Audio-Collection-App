import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import { useAuth } from "../contexts/AuthContext";

const defaultTheme = createTheme();

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export default function SignIn() {
  const { isLoggedIn, login, userRole } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      if (userRole === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  }, [isLoggedIn, userRole, navigate]);

  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);
    setIsEmailValid(validateEmail(emailInput));
  };

  const handlePasswordChange = (e) => {
    const passwordInput = e.target.value;
    setPassword(passwordInput);
    setIsPasswordValid(passwordInput.length >= 6);
  };

  const isSubmitDisabled = !isEmailValid || !email || !password || !isPasswordValid;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error.message);
      setError(
        error.message || "Failed to login. Please check your credentials."
      );
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              error={!isEmailValid}
              helperText={!isEmailValid && "Please enter a valid email address."}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              error={!isPasswordValid}
              helperText={!isPasswordValid && "Password must be at least 6 characters long."}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitDisabled}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {" "}
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
