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
  Snackbar,
  SnackbarContent
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { postData } from "../services/ServerServices";


export default function PaperDialog(props) {
  const fileInputRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const {
    submitted_by = "",
    address_line_one = "",
    address_line_two = "",
    author_college = "",
    author_designation = "",
    author_email = "",
    author_name = "",
    author_number = "",
    category = "",
    city = "",
    paper_id = "",
    idauthor = "",
    paper_abstract = "",
    paper_keywords = "",
    paper_title = "",
    paper_uploaded = "",
    postal_code = "",
    research_area = "",
  } = props.person || {}; // Destructure with default values

  const [formData, setFormData] = useState({
    id: paper_id,
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
      Id: paper_id,
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

  const handleCategoryChange = (event, newValue) => {
    setFormData({ ...formData, category: newValue });
  };



  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };


  const handleAddAuthor = () => {
    const updatedAuthors = [...formData.authors, {}];
    setFormData({ ...formData, authors: updatedAuthors });
  };

  const handleAuthorInputChange = (event, index) => {
    const { id, value } = event.target;
    const newAuthors = [...formData.authors];
    newAuthors[index] = { ...newAuthors[index], [id]: value };
    setFormData({ ...formData, authors: newAuthors });
  };

  const handleRemoveAuthor = (index) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({ ...formData, authors: newAuthors });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleUpdateFile()
    // Prepare the data object
    const data = {
      ...formData,
      authors: JSON.stringify(formData.authors),
      user_id: submitted_by,
    };
  // Prepare the data object
   // console.log("data h bhai",JSON.stringify(data));

    try {
      const result = await postData("form/Re_upload_paper", data);
      if (result.status) {
        setSnackbarMessage(result.message);
        // setSnackbarOpen(true);
        props.handleReplyDialogClose()
        Swal.fire({
          icon: "success",
          title: "updated Paper Succesfully",
          text: result.message || "Unknown error",
          timer: 1500,
        });
        props.fetchPapers()
        // console.log("Upload result:", result);
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
      const response = await postData("form/reupload_paper_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.message) {
        setOpen(true);
        setMessage(response.message);
      } else {
        setOpen(true);
        setMessage(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        "An error occurred during the upload. Please check the console for more details."
      );
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
              padding:10
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
                        id="authorName"
                        label={`Author ${index + 1} - Name`}
                        variant="outlined"
                        value={author.authorName}
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
                        id="designation"
                        label={`Author ${index + 1} - Designation`}
                        variant="outlined"
                        value={author.designation}
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
                        id="university"
                        label={`Author ${index + 1} - University/College Name`}
                        variant="outlined"
                        value={author.university}
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
                        id="contactNumber"
                        label={`Author ${index + 1} - Contact Number`}
                        variant="outlined"
                        value={author.contactNumber}
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
                        id="email"
                        label={`Author ${index + 1} - Email`}
                        variant="outlined"
                        value={author.email}
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
                        {`Remove Author - ${index + 1}`}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          message={snackbarMessage}
          sx={{ backgroundColor: '#0f0c29' }}
        />
      </Snackbar>
    </div>
  );
}
