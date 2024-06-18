import React from "react";
import { Grid, TextField, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import "../stylesheet/Contact.css";

import useMediaQuery from "@mui/material/useMediaQuery";

export default function Contact() {
  const matches = useMediaQuery("(min-width:600px)");
  return (
    <div className="ContactMain-Container">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ textAlign: "center" }}>
            <div
              className="Contact-heading" // Apply the CSS class here
              // variant="h3"
              // align="center"
            >
              Get in
              <span className="color-contact"> touch</span>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} style={{marginTop:"7vh"}}>
          <form style={{ padding: 10 }}>
            <Grid container spacing={2}>
              <Grid item xs={matches ? 6 : 12}>
                <Grid item xs={12} sm={12}>
                  <TextField fullWidth label="Name" id="name" name="name" />
                </Grid>
                <Grid item sx={{ mt: 2 }} xs={12} sm={12}>
                  <TextField fullWidth label="Email" id="email" name="email" />
                </Grid>
                <Grid item sx={{ mt: 2 }} xs={12} sm={12}>
                  <TextField
                    fullWidth
                    label="Mobile"
                    id="number"
                    name="number"
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
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}
