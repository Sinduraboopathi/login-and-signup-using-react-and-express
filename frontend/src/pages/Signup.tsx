import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import RouterLink
import axios from 'axios';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
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
      const response = await axios.post('http://localhost:5000/signup', formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setError('');
        navigate('/login'); // Redirect to login after successful signup
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during signup.');
      setSuccess(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Signup successful! Please log in.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
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

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Sign Up
          </Button>
        </form>

        {/* Fixed Link Routing to Login Page */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ cursor: 'pointer' }}>
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
