import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      if (response.status === 200) {
        localStorage.setItem('username', response.data.username); // Store username for homepage
        navigate('/home'); // Redirect to homepage after successful login
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Log In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Log In
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;