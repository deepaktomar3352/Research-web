import React, { useState, useEffect, useCallback } from "react";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { ServerURL, postData } from "../services/ServerServices";

const Root = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  padding: theme.spacing(3),
  backgroundColor: "#f5f5f5",
}));

const Cover = styled(Paper)(({ theme, bgcolor }) => ({
  height: 200,
  backgroundColor: bgcolor || "#3f51b5",
  position: "relative",
}));

const ChangeCoverButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  right: 10,
  top: 10,
  color: "white",
  borderColor: "white",
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  marginTop: "-50px",
  zIndex: 1,
  position: "relative",
}));

const ProfileAvatarContainer = styled("div")(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  margin: "auto",
  marginTop: "-70px",
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
}));

const EditIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "white",
  padding: theme.spacing(0.5),
  borderRadius: "50%",
  "&:hover": {
    backgroundColor: "#E8E8E8",
  },
}));

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const userString = localStorage.getItem("user");
  const viewerString = localStorage.getItem("viewer");

  const user = userString ? JSON.parse(userString) : null;
  const viewer = viewerString ? JSON.parse(viewerString) : null;

  const fetchProfile = useCallback(async () => {
    let result;
    if (user) {
      result = await postData("users/fetch_user_profile", { id: user.id });
    } else if (viewer) {
      result = await postData("viewer/fetch_viewer_profile", { id: viewer.id });
    }
    if (result) {
      setProfile(result.data[0]);
    }
  }, [user, viewer]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstname);
      setLastName(profile.lastname);
      setEmail(profile.email);
      setUserpicPreview(
        profile.userpic ? `${ServerURL}/images/${profile.userpic}` : ""
      );
    }
  }, [profile]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userpic, setUserpic] = useState(null);
  const [userpicPreview, setUserpicPreview] = useState("");

  const handleUpdateData = async () => {
    const formData = new FormData();
    formData.append("id", profile.id);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    if (userpic) {
      formData.append("userpic", userpic);
    }

    let result;
    if (user) {
      result = await postData("users/user_profile_update", formData, true);
      if (result) {
        Swal.fire({
          icon: "success",
          title: result.message,
          showConfirmButton: true,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: result.message,
          text: result.message || "Unknown error",
          timer: 1500,
        });
      }
    } else if (viewer) {
      result = await postData("viewer/viewer_profile_update", formData, true);
      if (result) {
        Swal.fire({
          icon: "success",
          title: result.message,
          showConfirmButton: true,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: result.message,
          text: result.message || "Unknown error",
          timer: 1500,
        });
      }
    }

    console.log(result);
    if (result.success) {
      fetchProfile();
    }
  };

  const handleChangeCover = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setCoverColor(randomColor);
    localStorage.setItem("coverColor", randomColor);
  };

  const handleUserpicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserpic(file);
      setUserpicPreview(URL.createObjectURL(file));
    }
  };

  const [coverColor, setCoverColor] = useState("#3f51b5");

  useEffect(() => {
    const savedColor = localStorage.getItem("coverColor");
    if (savedColor) {
      setCoverColor(savedColor);
    }
  }, []);

  if (!profile) {
    return (
      <Root>
        <Typography variant="h6" align="center">
          No profile information available.
        </Typography>
      </Root>
    );
  }

  return (
    <Root>
      <Cover bgcolor={coverColor}>
        <ChangeCoverButton variant="outlined" onClick={handleChangeCover}>
          Change Cover
        </ChangeCoverButton>
      </Cover>
      <Grid
        container
        spacing={3}
        style={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
      >
        <Grid item xs={12} sm={8}>
          <ProfilePaper>
            <ProfileAvatarContainer>
              <ProfileAvatar alt={profile.firstname} src={userpicPreview} />
              {viewer ? null : (
                <EditIconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleUserpicChange}
                  />
                  <EditIcon />
                </EditIconButton>
              )}
            </ProfileAvatarContainer>
            <Typography
              sx={{ fontWeight: 500 }}
              variant="h6"
            >{`${firstName} ${lastName}`}</Typography>
            <Typography style={{ marginBottom: "5%" }} variant="body2">
              {email}
            </Typography>

            <Typography variant="h6">Account Settings</Typography>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              InputProps={{
                readOnly: viewer ? true : false,
              }}
              InputLabelProps={{
                shrink: true, // This ensures the label doesn't float back up when readOnly
              }}
            />

            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              InputProps={{
                readOnly: viewer ? true : false,
              }}
              InputLabelProps={{
                shrink: true, // This ensures the label doesn't float back up when readOnly
              }}
            />
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                readOnly: viewer ? true : false,
              }}
              InputLabelProps={{
                shrink: true, // This ensures the label doesn't float back up when readOnly
              }}
            />
            {viewer ? null : (
              <Button
                onClick={handleUpdateData}
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
            )}
          </ProfilePaper>
        </Grid>
      </Grid>
    </Root>
  );
};

export default UserProfile;
