import React, { useState } from "react";
import { Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { faker } from '@faker-js/faker';

const generateRandomUser = () => ({
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
});

const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(generateRandomUser());

  const handleOpen = () => {
    setUser(generateRandomUser());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" color="primary">
        View Profile
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          <Avatar alt={user.username} src={user.avatar} />
          <Typography variant="h5" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="subtitle1">{user.email}</Typography>
          <Typography variant="subtitle1">Age: {user.age}</Typography>
          <Typography variant="subtitle1">Location: {user.location}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserProfile;
