import React from 'react';
import { Avatar, Button, Grid, Paper, TextField, Typography, Select, MenuItem, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
}));

const Cover = styled(Paper)(({ theme }) => ({
  height: 200,
  backgroundColor: '#3f51b5',
  position: 'relative',
}));

const ChangeCoverButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  right: 10,
  top: 10,
  color: 'white',
  borderColor: 'white',
}));

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  margin: 'auto',
}));

const UserProfile = () => {
  return (
    <Root>
      <Cover>
        <ChangeCoverButton variant="outlined">Change Cover</ChangeCoverButton>
      </Cover>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <ProfilePaper>
            <ProfileAvatar alt="Tim Cook" src="/path-to-image.jpg" />
            <Typography variant="h6">Tim Cook</Typography>
            <Typography variant="body2">CEO of Apple</Typography>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body1">32</Typography>
                <Typography variant="body2">Opportunities applied</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">26</Typography>
                <Typography variant="body2">Opportunities won</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">6</Typography>
                <Typography variant="body2">Current opportunities</Typography>
              </Grid>
            </Grid>
            <Button variant="contained" color="primary" style={{ marginTop: 10 }}>
              View Public Profile
            </Button>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              defaultValue="https://domain.com/user"
              InputProps={{
                readOnly: true,
              }}
            />
          </ProfilePaper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <ProfilePaper>
            <Typography variant="h6">Account Settings</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="First Name"
              defaultValue="Tim"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Last Name"
              defaultValue="Cook"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Phone Number"
              defaultValue="(408) 996-1010"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email Address"
              defaultValue="tcook@apple.com"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="City"
              defaultValue="New York"
            />
            <Select
              variant="outlined"
              margin="normal"
              fullWidth
              defaultValue="America"
            >
              <MenuItem value="America">America</MenuItem>
              {/* Add other options as needed */}
            </Select>
            <Button variant="contained" color="primary" fullWidth>
              Update
            </Button>
          </ProfilePaper>
        </Grid>
      </Grid>
    </Root>
  );
};

export default UserProfile;
