import { React, useState } from "react";
import {
  Grid,
  TextField,
  Divider,
  TextareaAutosize,
  Autocomplete,
  Button,
  Input,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import "../stylesheet/ArticlePage.css";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { postData } from "../services/ServerServices";
import Swal from "sweetalert2";

export default function ArticlePage() {
  const [subject, setSubject] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    manuscriptTitle: "",
    authorName: "",
    reviewersArea: "",
    abstract: "",
    name: "",
    affiliation: "",
    email: "",
    number: "",
  });

  const user = localStorage.getItem("user");
  const userObject = JSON.parse(user);
  const user_id = userObject.id;

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a valid file (PDF, DOC, DOCX, JPEG, or PNG)");
    }
  };

  const EmptyData = () => {
    setFormData({
      manuscriptTitle: "",
      authorName: "",
      reviewersArea: "",
      abstract: "",
      name: "",
      affiliation: "",
      email: "",
      number: "",
    });
    setSubject("");
    setFile(null);
  };
  const handleDataSubmit = async () => {
    const dataToSend = new FormData();
    dataToSend.append("subject", subject);
    dataToSend.append("user_id", user_id);
    // Append all key-value pairs from formData
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        dataToSend.append(key, value);
      }
    });

    // Append file if it exists
    if (file) {
      dataToSend.append("uploaded_article", file);
      // console.log("File", file);
    }

    // Debugging: Output the content of FormData
    // console.log("Form data to send:");
    // for (const [key, value] of dataToSend.entries()) {
    //   console.log(`${key}: ${value}`);
    // }

    try {
      const result = await postData("form/submit_article", dataToSend);
      if (result.status) {
        Swal.fire({
          icon: "success",
          // title: "Paper Submit successfully!.",
          text: result.message,
          showConfirmButton: false,
          timer: 1500,
        });
        EmptyData();
        console.log("Upload result:", result);
      } else {
        Swal.fire({
          icon: "error",
          title: "Paper Submit failed",
          text: result.message || "Unknown error",
          timer: 1500,
        });
        console.error("Upload error:", result.message);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  const renderPreview = () => {
    if (!file) return null;

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: 100 }}
        />
      );
    } else if (file.type === "application/pdf") {
      return <DescriptionIcon fontSize="large" />;
    } else if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <DescriptionIcon fontSize="large" />;
    } else {
      return null;
    }
  };

  const handleChange = (event, value) => {
    setSubject(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your validation logic here
    if (validateForm()) {
      handleDataSubmit();
    } else {
      // Form validation failed
      console.log("Form validation failed.");
    }
  };

  const validateForm = () => {
    const {
      manuscriptTitle,
      authorName,
      reviewersArea,
      abstract,
      name,
      email,
      number,
    } = formData;

    // Check if required fields are filled
    if (
      !manuscriptTitle ||
      !authorName ||
      !reviewersArea ||
      !abstract ||
      !name ||
      !email ||
      !number
    ) {
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Validate phone number format (allowing only numbers)
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(number)) {
      return false;
    }

    // All validations passed
    return true;
  };

  return (
    <div>
      <div className="article-container">
        <Paper className="article-subcontainer">
          <div className="article-heading1">
            Submit{" "}
            <div style={{ color: "#FF6A3D", marginLeft: 10 }}>Articles</div>
          </div>
          <Divider />
          <div className="article-heading2">ARTICLE DETAIL :</div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container rowSpacing={1} spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  required
                  id="manuscriptTitle"
                  label="Manuscript Title"
                  variant="outlined"
                  value={formData.manuscriptTitle}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  required
                  id="authorName"
                  label="Author(s) Name"
                  variant="outlined"
                  value={formData.authorName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  value={subject}
                  onChange={handleChange}
                  options={[
                    "Life sciences and Health Sciences",
                    "Physical, Chemical Sciences & Engineering",
                    "Arts and Humanities",
                    "Accounting & Commerce",
                  ]}
                  renderInput={(params) => (
                    <TextField
                      autoComplete="off"
                      {...params}
                      label="Select Subject"
                      variant="outlined"
                      style={{
                        backgroundColor: "white",
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  required
                  id="reviewersArea"
                  label="Reviewers Area"
                  variant="outlined"
                  value={formData.reviewersArea}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  required
                  minRows={3}
                  maxRows={3}
                  style={{
                    width: "100%",
                    padding: 15,
                    border: "1px dotted grey",
                    borderRadius: 5,
                    resize: "vertical",
                  }}
                  placeholder="Abstract"
                  id="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <div>
                  <Input
                    type="file"
                    name="uploaded_article" // This name should match the backend field
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    inputProps={{
                      accept: "application/pdf,.doc,.docx,image/jpeg,image/png",
                    }}
                    id="contained-button-file"
                  />
                  <label htmlFor="contained-button-file">
                    <Button
                      fullWidth
                      variant="contained"
                      style={{ backgroundColor: "#1A2238" }}
                      component="span"
                    >
                      Upload File
                    </Button>
                  </label>
                </div>
              </Grid>
              <Grid item xs={6}>
                {error && <div style={{ color: "red" }}>{error}</div>}
                {file && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div>{renderPreview()}</div>
                    <div style={{ color: " #1A2238", fontWeight: 600 }}>
                      Selected file: {file.name}
                    </div>
                  </div>
                )}
              </Grid>
            </Grid>
            <Divider style={{ margin: 10 }} />

            <div className="article-heading2">
              CORRESPONDING AUTHORS DETAIL :
            </div>
            <Grid container rowSpacing={1} spacing={2}>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  required
                  id="name"
                  label="Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  id="affiliation"
                  label="Affiliation"
                  variant="outlined"
                  value={formData.affiliation}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  required
                  id="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  autoComplete="off"
                  fullWidth
                  required
                  id="number"
                  label="Number"
                  type="tel"
                  variant="outlined"
                  value={formData.number}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#1A2238", marginTop: 20 }}
            >
              Submit
            </Button>
          </form>
        </Paper>
      </div>
    </div>
  );
}
