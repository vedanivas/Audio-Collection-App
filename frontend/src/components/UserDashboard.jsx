import React, { useEffect, useState } from "react";
import {
  CircularProgress,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import AudioRecorder from "./AudioRecorder";
import url from "../url";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

function UserDashboard() {
  const [sentences, setSentences] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const ROOT = url();

  useEffect(() => {
    fetchSentences();
  }, []);

  const fetchSentences = () => {
    fetch(ROOT + "users/fetchSentences", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch sentences");
        }
        return response.json();
      })
      .then((data) => {
        setSentences(data.body);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching sentences:", error);
        setError("Failed to fetch sentences. Please try again later.");
        setLoading(false);
      });
  };

  const handleNextSentence = () => {
    setCurrentSentenceIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="body1">{error}</Typography>;
  }

  return (
    <>
      <AppBar
        position="static"
        style={{ zIndex: 1300, backgroundColor: "blue" }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <div style={{ textAlign: "center" }}>
        <Typography variant="h5">Sentence to Record</Typography>
        {sentences.length > 0 ? (
          <div>
            <Typography variant="body1" style={{ marginTop: "1rem" }}>
              {sentences[currentSentenceIndex]}
            </Typography>
            <AudioRecorder />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "1rem" }}
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
    </>
  );
}

export default UserDashboard;
