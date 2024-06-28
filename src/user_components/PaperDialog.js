import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Avatar,
  Paper,
  Divider,
  Grid,
  TextareaAutosize,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { postData } from "../services/ServerServices";
import CloudSyncIcon from "@mui/icons-material/CloudSync";

export default function PaperDialog(props) {
  const fileInputRef = useRef(null);
  const {
    user_id = "",
    address_line_one = "",
    address_line_two = "",
    author_college = "",
    author_designation = "",
    author_email = "",
    author_name = "",
    author_number = "",
    category = "",
    city = "",
    id = "",
    idauthor = "",
    paper_abstract = "",
    paper_keywords = "",
    paper_title = "",
    paper_uploaded = "",
    postal_code = "",
    research_area = "",
  } = props.person || {}; // Destructure with default values

  const [formData, setFormData] = useState({
    Id: id,
    user_id: user_id,
    paperTitle: paper_title,
    researchArea: research_area,
    uploadPaper: paper_uploaded,
    keywords: paper_keywords,
    abstract: paper_abstract,
    category: category,
    authors: [
      {
        authorId: idauthor,
        authorName: author_name,
        designation: author_designation,
        university: author_college,
        contactNumber: author_number,
        email: author_email,
      },
    ],
    addressLine1: address_line_one,
    addressLine2: address_line_two,
    city: city,
    postalCode: postal_code,
  });

  useEffect(() => {
    // Update formData when props.person changes
    setFormData({
      Id: id,
      paperTitle: paper_title,
      researchArea: research_area,
      uploadPaper: paper_uploaded,
      keywords: paper_keywords,
      abstract: paper_abstract,
      category: category,
      authors: [
        {
          authorId: idauthor,
          authorName: author_name,
          designation: author_designation,
          university: author_college,
          contactNumber: author_number,
          email: author_email,
        },
      ],
      addressLine1: address_line_one,
      addressLine2: address_line_two,
      city: city,
      postalCode: postal_code,
    });
  }, [props.person]); // Dependencies array to re-run effect when props.person changes

  console.log(props.person);

  const handleCategoryChange = (event, newValue) => {
    setFormData({ ...formData, category: newValue });
  };

  const EmptyData = () => {
    setFormData({
      Id: id,
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
      const result = await postData("form/Re_upload_paper", form);
      if (result.status) {
        Swal.fire({
          icon: "success",
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

  const handleUpdateFile = async (event, paperID) => {
    const file = event.target.files[0];
    console.log("paperID", paperID);
    console.log("file", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("paper_id", paperID);

    try {
      const response = await postData("form/reupload_paper", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response", response);
      alert(response.message);
    } catch (error) {
      console.error("There was an error uploading the file!", error);

      alert(error);
    }
  };

  return (
    <div>
      <Dialog
        maxWidth="md"
        PaperProps={{
          style: {
            width: "60%", // Adjust as needed
            position: "relative",
          },
        }}
        open={props.replyDialogOpen}
        onClose={props.handleReplyDialogClose}
      >
        <DialogTitle>Paper Details</DialogTitle>
        <IconButton
          onClick={props.handleReplyDialogClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div
            style={{
              overflowY: "scroll",
              WebkitScrollbar: {
                display: "none", // Hides scrollbar in WebKit browsers
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
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
                    type="file"
                    name="uploadPaper"
                    id="uploadPaper"
                    label=""
                    variant="outlined"
                    onChange={(event) => handleUpdateFile(event, formData.Id)}
                    ref={fileInputRef}
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
                  style={{
                    margin: 10,
                    backgroundColor: "red",
                    width: "100%",
                  }}
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
