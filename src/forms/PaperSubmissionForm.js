import { React, useState } from "react";
import {
  Grid,
  TextField,
  Divider,
  TextareaAutosize,
  Button,
  Autocomplete,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import "../stylesheet/ArticlePage.css";
import { postData } from "../services/ServerServices";
import Swal from "sweetalert2";

export default function PaperSubmissionForm() {
  const user = localStorage.getItem("user");
  const userObject = JSON.parse(user);
  const id = userObject.id;
  const [formData, setFormData] = useState({
    user_id: id,
    paperTitle: "",
    researchArea: "",
    uploadPaper: "",
    keywords: "",
    abstract: "",
    category: "",
    authors: [],
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
  });

  const handleCategoryChange = (event, newValue) => {
    setFormData({ ...formData, category: newValue });
  };

  const EmptyData = () => {
    setFormData({
      user_id: id,
      paperTitle: "",
      researchArea: "",
      uploadPaper: "",
      keywords: "",
      abstract: "",
      category:"",
      authors: [],
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
    });
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFormData({ ...formData, uploadPaper: selectedFile });
  };

  const handleAuthorInputChange = (event, index) => {
    const { id, value } = event.target;
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index][id] = value;
    setFormData({ ...formData, authors: updatedAuthors });
  };

  const handleAddAuthor = () => {
    const updatedAuthors = [...formData.authors, {}];
    setFormData({ ...formData, authors: updatedAuthors });
  };

  const handleRemoveAuthor = (index) => {
    const updatedAuthors = formData.authors.filter((_, i) => i !== index);
    console.log("index", index);
    setFormData({ ...formData, authors: updatedAuthors });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = new FormData();

    // Append regular fields
    Object.keys(formData).forEach((key) => {
      if (key === "authors") {
        // Serialize authors field
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const result = await postData("form/upload_paper", form);
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
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <div className="article-container">
        <Paper className="article-subcontainer">
          <div className="article-heading1">
            Paper{" "}
            <div style={{ color: "#FF6A3D", marginLeft: 10 }}>Submission</div>
          </div>
          <Divider style={{ margin: 10 }} />
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container rowSpacing={1} spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  required
                  id="paperTitle"
                  label="Paper Title"
                  variant="outlined"
                  value={formData.paperTitle}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  required
                  id="researchArea"
                  label="Research Area"
                  variant="outlined"
                  value={formData.researchArea}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  required
                  type="file"
                  name="uploadPaper"
                  id="uploadPaper"
                  label=""
                  variant="outlined"
                  onChange={handleFileChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  id="keywords"
                  label="Keywords of your paper"
                  variant="outlined"
                  value={formData.keywords}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextareaAutosize
                  required
                  autoComplete="off"
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
                <Autocomplete
                  fullWidth
                  value={formData.category}
                  onChange={handleCategoryChange}
                  options={[
                    "Life sciences and Health Sciences",
                    "Physical, Chemical Sciences & Engineering",
                    "Arts and Humanities",
                    "Accounting & Commerce",
                  ]}
                  renderInput={(params) => (
                    <TextField
                      required
                      autoComplete="off"
                      {...params}
                      label="Select Category"
                      variant="outlined"
                      style={{
                        backgroundColor: "white",
                      }}
                    />
                  )}
                />
              </Grid>

              <Divider
                style={{ margin: 10, backgroundColor: "red", width: "100%" }}
              />
              <Grid item xs={12} className="article-heading2">
                Author Details :
              </Grid>
              {formData.authors.map((author, index) => (
                <Grid
                  style={{ padding: 20 }}
                  container
                  key={index}
                  rowSpacing={1}
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      autoComplete="off"
                      required
                      id={`authorName${index}`}
                      label={`Author ${index + 1} - Name`}
                      variant="outlined"
                      value={formData.authors[index].authorName}
                      onChange={(event) =>
                        handleAuthorInputChange(event, index)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      required
                      autoComplete="off"
                      id={`designation${index}`}
                      label={`Author ${index + 1} - Designation`}
                      variant="outlined"
                      value={formData.authors[index].designation}
                      onChange={(event) =>
                        handleAuthorInputChange(event, index)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      autoComplete="off"
                      fullWidth
                      required
                      id={`university${index}`}
                      label={`Author ${index + 1} - University/College Name`}
                      variant="outlined"
                      value={formData.authors[index].university}
                      onChange={(event) =>
                        handleAuthorInputChange(event, index)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      autoComplete="off"
                      required={index === 0} // Only first author's contact number is required
                      id={`contactNumber${index}`}
                      label={`Author ${index + 1} - Contact Number`}
                      variant="outlined"
                      value={formData.authors[index].contactNumber}
                      onChange={(event) =>
                        handleAuthorInputChange(event, index)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      autoComplete="off"
                      required={index === 0} // Only first author's email is required
                      id={`email${index}`}
                      label={`Author ${index + 1} - Email`}
                      variant="outlined"
                      value={formData.authors[index].email}
                      onChange={(event) =>
                        handleAuthorInputChange(event, index)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleRemoveAuthor(index)}
                      // style={{ backgroundColor: "#9DAAF2" }}
                    >
                      {`Remove Author -${index + 1}`}
                    </Button>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#1A2238" }}
                  onClick={handleAddAuthor}
                >
                  Add Author
                </Button>
              </Grid>
              <Divider style={{ margin: 10, width: "100%" }} />
              <Grid item xs={12} className="article-heading2">
                Address of Communication :
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  required
                  id="addressLine1"
                  label="Address Line 1"
                  variant="outlined"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  id="addressLine2"
                  label="Address Line 2"
                  variant="outlined"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  id="city"
                  label="City/District"
                  variant="outlined"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  required
                  id="postalCode"
                  label="Postal Code"
                  variant="outlined"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "#1A2238", marginTop: 10 }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
    </div>
  );
}
