import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Box, Typography, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { postData } from '../services/ServerServices';
import Swal from "sweetalert2";


const defaultTheme = createTheme();

function UserResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  console.log("password",password)

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await postData(`users/reset_password/${token}`, {password:password });

    if (result.status) {
        Swal.fire({
            icon: "success",
            title: "Password reset successfully!.",
            showConfirmButton: false,
            timer: 1500,
          });
      navigate("/signin");
    } else {
        Swal.fire({
            icon: "error",
            title: "Reset password failed",
            text: result.message || "Unknown error",
            timer: 1500,
          });
      alert("Reset failed: " + result.message);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main"  sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f0c29",
        backgroundImage:
          "-webkit-linear-gradient(to right, #24243e, #302b63, #0f0c29)",
        backgroundImage: "linear-gradient(to right, #24243e, #302b63, #0f0c29)",
      }}>
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">Reset Password</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2,background:"#0f0c29" }}
                
              >
                Reset Password
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default UserResetPassword;
