import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
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
import { postData } from "../services/ServerServices";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { motion } from "framer-motion";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .required("Password is require"),
});

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const body = {
          email: values.email,
          password: values.password,
        };
        if (value === 1) {
          const result = await postData("viewer/viewer_login", body);
          if (result && result.status) {
            console.log("result:-", result);
            localStorage.setItem("viewer", JSON.stringify(result.viewer));
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Login successful!",
              showConfirmButton: false,
              timer: 500,
            });
            navigate("/ViewerDashboard");
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
        console.error("Error during login:", error);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error || "Unknown error",
          timer: 2000,
        });
      }
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%", transition: { duration: 0.3 } }}
      exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
    >
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage:
                "url('https://source.unsplash.com/random?research')",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
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
                onSubmit={formik.handleSubmit}
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
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
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
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, background: "#0f0c29" }}
                >
                  Sign In
                </Button>
                {value === 0 ? (
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
                ) : (
                  <></>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {"Copyright "}
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
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </motion.div>
  );
}
