import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { Grid, TextField, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import "../stylesheet/Contact.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import Snackbar from "@mui/material/Snackbar";
import * as Yup from "yup";

// Define Yup schema for validation
const schema = Yup.object().shape({
  user_name: Yup.string().required("Name is required"),
  user_email: Yup.string().email("Invalid email address").required("Email is required"),
  user_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be a valid 10-digit number")
    .required("Mobile number is required"),
  message: Yup.string().required("Message is required"),
});

export default function Contact() {
  const matches = useMediaQuery("(min-width:600px)");
  const form = useRef();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const validateForm = async (formData) => {
    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const fieldErrors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(fieldErrors);
      return false;
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);

    const data = {
      user_name: formData.get('user_name'),
      user_email: formData.get('user_email'),
      user_number: formData.get('user_number'),
      message: formData.get('message'),
    };

    if (!await validateForm(data)) {
      return;
    }

    emailjs
      .sendForm("service_hdfsqs8", "template_4x4d54a", form.current, {
        publicKey: "Gy9dfTlrVwJ9Y9j6J",
      })
      .then(
        () => {
          setOpen(true);
          setMessage("Email sent successfully");
          form.current.reset();  // Reset the form fields
        },
        (error) => {
          setOpen(true);
          setMessage(error.text);
        }
      );
  };

  return (
    <div className="ContactMain-Container">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ textAlign: "center" }}>
            <div className="Contact-heading">
              <motion.div
                initial={{ translateX: -200 }}
                whileInView={{ translateX: 0 }}
                transition={{ duration: 0.6 }}
                className="color-contact"
              >
                Get in touch
              </motion.div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} style={{ marginTop: "7vh" }}>
          <motion.div
            initial={{ translateY: 100, opacity: 0 }}
            whileInView={{ translateY: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <form ref={form} onSubmit={sendEmail} style={{ padding: 10 }}>
              <Grid container spacing={2}>
                <Grid item xs={matches ? 6 : 12}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      id="name"
                      name="user_name"
                      error={!!errors.user_name}
                      helperText={errors.user_name}
                    />
                  </Grid>
                  <Grid item sx={{ mt: 2 }} xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      id="email"
                      name="user_email"
                      error={!!errors.user_email}
                      helperText={errors.user_email}
                    />
                  </Grid>
                  <Grid item sx={{ mt: 2 }} xs={12} sm={12}>
                    <TextField
                      fullWidth
                      label="Mobile"
                      id="number"
                      name="user_number"
                      error={!!errors.user_number}
                      helperText={errors.user_number}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={matches ? 6 : 12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={7}
                    label="Message"
                    id="message"
                    name="message"
                    error={!!errors.message}
                    helperText={errors.message}
                  />
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={matches ? 6 : 12}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="btn-Contact"
                    style={{ backgroundColor: "#1a2238", marginTop: -10 }}
                  >
                    Submit
                  </Button>
                  <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    message={message}
                  />
                </Grid>
              </Grid>
            </form>
          </motion.div>
        </Grid>
      </Grid>
    </div>
  );
}
