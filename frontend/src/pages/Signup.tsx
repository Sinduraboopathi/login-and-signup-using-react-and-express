import React from "react";
import { Container, Typography, TextField, Button, Box, Alert, Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema using Yup
const schema = yup.object().shape({
  username: yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const SignupPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [serverError, setServerError] = React.useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("http://localhost:5000/signup", data);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || "An error occurred during signup.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Username"
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={isSubmitting}>
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Log In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;
