import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

const HomePage: React.FC = () => {
  const [fact, setFact] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

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

    fetchFact();
  }, []);

  const username = localStorage.getItem('username');

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome, {username}!
        </Typography>

        <Typography variant="h6" align="center" gutterBottom>
          Here's a random fact for you:
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <Typography variant="body1" align="center">
            {fact}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;