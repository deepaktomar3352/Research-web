import React, { useState, useEffect } from 'react';
import { Avatar, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ServerURL } from '../services/ServerServices';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
}));

const Cover = styled(Paper)(({ theme, bgcolor }) => ({
  height: 200,
  backgroundColor: bgcolor || '#3f51b5',
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
  marginTop: '-50px', // Bring the ProfilePaper up
  zIndex: 1,
  position: 'relative',
  [theme.breakpoints.up('sm')]: {
    marginLeft: '50px',
    marginRight: '15px',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: '0px',
    marginRight: '0px',
    marginTop: '-10px', 
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
  margin: 'auto',
}));

const UserProfile = () => {
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);

  const [coverColor, setCoverColor] = useState('#3f51b5');

  useEffect(() => {
    const savedColor = localStorage.getItem('coverColor');
    if (savedColor) {
      setCoverColor(savedColor);
    }
  }, []);

  const handleChangeCover = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setCoverColor(randomColor);
    localStorage.setItem('coverColor', randomColor);
  };

  return (
    <Root>
      <Cover bgcolor={coverColor}>
        <ChangeCoverButton variant="outlined" onClick={handleChangeCover}>
          Change Cover
        </ChangeCoverButton>
      </Cover>
      <Grid container spacing={3} style={{ flexGrow: 1 }}>
        <Grid item xs={12} sm={4}>
          <ProfilePaper>
            <ProfileAvatar alt={user.firstname || 'User'} src={`${ServerURL}/images/${user.userpic}`} />
            <Typography variant="h6">{`${user.firstname || 'First Name'} ${user.lastname || 'Last Name'}`}</Typography>
            <Typography variant="body2">{user.email || 'Email'}</Typography>
          </ProfilePaper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <ProfilePaper>
            <Typography variant="h6">Account Settings</Typography>
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              label="First Name"
              defaultValue={user.firstname || ''}
            />
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              label="Last Name"
              defaultValue={user.lastname || ''}
            />
            <TextField
              variant="outlined"
              margin="dense"
              fullWidth
              label="Email Address"
              defaultValue={user.email || ''}
            />
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
