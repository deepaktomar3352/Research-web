// import React from 'react'

// export default function UserSelection() {
//      const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
//        const handleCheckboxChange = (event, userId) => {
//     if (event.target.checked) {
//       setSelectedUsers([...selectedUsers, userId]);
//       console.log("Selected users", selectedUsers);
//     } else {
//       setSelectedUsers(selectedUsers.filter((id) => id !== userId));
//     }
//   };

//   const handleSendData = () => {
//     setOpenDialog(false);
//     // setSelectedUsers([]);
//   };

//   const handleAccept = (person) => {
//     setAcceptedUsers([...acceptedUsers, person.user_id]); // Store only the ID
//   };
  
//   return (
//     <div>
//        {/****************** Dialog Box Start ******************************/}
//       <Dialog
//         maxWidth="md"
//         PaperProps={{
//           style: {
//             width: matches ? "50%" : "30%",
//             maxHeight: "60vh",
//             position: "relative",
//           },
//         }}
//         open={openDialog}
//         onClose={handleDialogClose}
//       >
//         <DialogTitle className="dialog-title">Select Users</DialogTitle>
//         {peopleData.map((person) => (
//           <DialogContent key={person.user_id}>
//             <DialogContentText>
//               <FormControlLabel
//                 sx={{ display: "flex", flexDirection: "row" }}
//                 control={
//                   <Checkbox
//                     checked={selectedUsers.includes(person.user_id)}
//                     onChange={(event) =>
//                       handleCheckboxChange(event, person.user_id)
//                     }
//                   />
//                 }
//                 label={person.firstname + " " + person.lastname}
//               />
//             </DialogContentText>
//           </DialogContent>
//         ))}

//         <DialogActions className="dialog-actions">
//           <Button onClick={handleDialogClose}>Cancel</Button>
//           <Button autoFocus onClick={handleSendData} color="primary">
//             Send
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   )
// }
