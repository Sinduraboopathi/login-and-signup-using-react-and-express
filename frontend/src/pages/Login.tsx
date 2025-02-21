import React from "react";
import { Container, Typography, TextField, Button, Box, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema using Yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginPage: React.FC = () => {
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
      const response = await axios.post("http://localhost:5000/login", data);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        navigate("/home");
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" align="center" gutterBottom>
          Log In
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
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
            {isSubmitting ? "Logging In..." : "Log In"}
          </Button>
        </form>

            
      </Box>
    </Container>
  );
};

export default LoginPage;

