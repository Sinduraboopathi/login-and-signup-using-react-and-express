import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const HomePage: React.FC = () => {
  const [fact, setFact] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<string | null>(null);

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const data = await response.json();
        setFact(data.text);
      } catch (err) {
        console.error('Error fetching fact:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/profile', {
            headers: { Authorization: token }
          });
          setProfile(response.data.message);
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      }
    };

    fetchFact();
    fetchProfile();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>Welcome!</Typography>

        {profile && (
          <Typography variant="h6" align="center" gutterBottom>{profile}</Typography>
        )}

        <Typography variant="h6" align="center" gutterBottom>Here's a random fact for you:</Typography>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Typography variant="body1" align="center">{fact}</Typography>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
