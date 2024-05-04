// Step 2: Import Axios
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
import { postData } from "../services/ServerServices";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useMediaQuery } from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" to="https://localhost:3000/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

function FileNamePreview({ fileName }) {
  return (
    <Typography variant="body1" color="textPrimary">
      {fileName?<>
        <span style={{color:"red"}} >Selected File:</span> {fileName}
      </>:null}
    </Typography>
  );
}

export default function SignUp() {
  const navigate = useNavigate();
  const mathes = useMediaQuery('(max-width:600px)');
  const [selectedFileName, setSelectedFileName] = React.useState("");
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFileName(file ? file.name : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const isEmailUpdatesAllowed = data.has("allowExtraEmails");
    // Step 4: Prepare data and send to backend using Axios
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
    console.log("data", formData);
    try {
      var result = await postData("users/user_register", formData);
      if (result.status) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Register successfully!",
          showConfirmButton: false,
          timer: 500,
        });
        navigate("/signin");
        console.log("Form submitted successfully!");
      }
      else{
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
                />
              </Grid>
              <Grid item xs={mathes?12:6}>
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
              <Grid item xs={mathes?12:6}>
                <FileNamePreview fileName={selectedFileName} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="allowExtraEmails" color="primary" />}
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
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
