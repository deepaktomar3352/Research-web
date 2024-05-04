import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper,Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { postData } from "../services/ServerServices";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Swal from "sweetalert2";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const defaultTheme = createTheme();



function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await postData("users/forgot_password", { email });

    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Password reset email sent.",
        showConfirmButton: true,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error sending password reset email",
        text: result.message || "Unknown error",
        timer: 1500,
      });
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
        <Box  sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
        {" "}
        <Typography variant="h6" sx={{ mb: 3 }}>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2,background:"#0f0c29" }}>
            Reset Password
          </Button>
        </form>
        <Box sx={{ mt: 2 }}>
          <Link to="/signin" style={{ textDecoration: "none",display:"flex",justifyContent:"center",alignItems:"center" }}>
           <KeyboardBackspaceIcon style={{marginRight:5}} />  Back to Sign In
          </Link>
        </Box>
        </Box>
      </Grid>
   </Grid>
   </ThemeProvider>
  );
}

export default ForgotPassword;
