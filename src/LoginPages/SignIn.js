import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { getData, postData } from "../services/ServerServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        style={{ textDecoration: "none" }}
        to="https://localhost:3000/"
      >
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const formData = new FormData(event.currentTarget); // Create FormData from the form
      const body = {
        email: formData.get("email"),
        password: formData.get("password"),
      };
      if (value === 1) {
        const result = await postData("viewer/viewer_login", body);
        if (result && result.status) {
          console.log("result:-", result);
          localStorage.setItem("viewer", JSON.stringify(result.user));
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login successful!",
            showConfirmButton: false,
            timer: 500,
          });
          navigate("/ViewerDashboard");
          // console.log(result);
        } else {
          Swal.fire({
            icon: "error",
            title: "Login failed",
            text: result?.message || "please check your credentials",
            timer: 1500,
          });
          console.warn("Login failed:", result?.message || "Unknown error");
        }
      } else {
        const result = await postData("users/user_login", body);
        if (result && result.status) {
          console.log("result:-", result);
          localStorage.setItem("user", JSON.stringify(result.user));
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login successful!",
            showConfirmButton: false,
            timer: 500,
          });
          navigate("/");
          // console.log(result);
        } else {
          Swal.fire({
            icon: "error",
            title: "Login failed",
            text: result?.message || "please check your credentials",
            timer: 1500,
          });
          console.warn("Login failed:", result?.message || "Unknown error");
        }
      }
    } catch (error) {
      console.error("Error during login:", error); // Log any errors
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: error || "Unknown error",
        timer: 2000,
      });
      // alert("An error occurred during login. Please try again.");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log("new values", newValue);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random?research)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
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
            <Typography>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="icon label tabs example"
              >
                <Tab icon={<PersonPinIcon />} label="user" />
                <Tab icon={<PersonSearchIcon />} label="Viewer" />
              </Tabs>
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
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
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Link style={{ textDecoration: "none" }} to=""></Link>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    to="/forgot-password"
                    style={{ textDecoration: "none" }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link style={{ textDecoration: "none" }} to="/SignUp">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
