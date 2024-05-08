import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { postData } from "../../services/ServerServices";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Paper, useMediaQuery } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
  // Add your password validation logic here
  return password.length >= 8; // For example, password should be at least 8 characters long
}

function validateForm(formData) {
  const errors = {};

  if (!formData.get("firstName")) {
    errors.firstName = "First name is required";
  }

  if (!formData.get("lastName")) {
    errors.lastName = "Last name is required";
  }

  const email = formData.get("email");
  if (!email || !validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  const password = formData.get("password");
  if (!password || !validatePassword(password)) {
    errors.password = "Password must be at least 8 characters long";
  }

  return errors;
}

function FileNamePreview({ fileName }) {
  return (
    <Typography variant="body1" color="textPrimary">
      {fileName ? (
        <>
          <span style={{ color: "red" }}>Selected File:</span> {fileName}
        </>
      ) : null}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Viewer_Registration() {
  const navigate = useNavigate();
  const mathes = useMediaQuery('(max-width:600px)');
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const [errors, setErrors] = React.useState({});
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFileName(file ? file.name : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const errors = validateForm(data);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const isEmailUpdatesAllowed = data.has("allowExtraEmails");
    const formData = new FormData();
    formData.append("firstname", data.get("firstName"));
    formData.append("lastname", data.get("lastName"));
    formData.append("email", data.get("email"));
    formData.append("password", data.get("password"));
    formData.append("receiveUpdates", isEmailUpdatesAllowed ? true : false);

    const image = data.get("userImage");
    if (image && image.size > 0) {
      formData.append("userImage", image);
    }

    try {
      var result = await postData("viewer/viewer_register", formData);
      if (result.status) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Register successfully!",
          showConfirmButton: false,
          timer: 500,
        });
        navigate("/signin");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: result?.message || "Unknown error",
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Paper>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="off"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="off"
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="off"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="off"
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid>
                <Grid item xs={mathes ? 12 : 6}>
                  <input
                    type="file"
                    accept="image/*"
                    id="userImage"
                    style={{ display: "none" }}
                    name="userImage"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="userImage">
                    <Button
                      variant="contained"
                      endIcon={<CloudUploadIcon />}
                      component="span"
                      fullWidth
                    >
                      Upload Profile
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={mathes ? 12 : 6}>
                  <FileNamePreview fileName={selectedFileName} />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox name="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive updates via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/SignIn" style={{ textDecoration: "none" }}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Paper>
    </ThemeProvider>
  );
}
