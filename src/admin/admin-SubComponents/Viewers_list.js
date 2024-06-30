import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Avatar, Button, ButtonGroup, TextField,Snackbar } from "@mui/material";
import { getData, postData, ServerURL } from "../../services/ServerServices";

// Custom component for editing the password field
function PasswordField({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextField
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button type="button" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? "Hide" : "Show"}
      </Button>
    </div>
  );
}

export default function Viewers_list() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    {
      title: "First Name",
      field: "firstname",
      initialEditValue: "initial edit value",
    },
    {
      title: "Last Name",
      field: "lastname",
      initialEditValue: "initial edit value",
    },
    {
      title: "Email",
      field: "email",
      initialEditValue: "initial edit value",
    },
    {
      title: "Password",
      field: "password",
      render: (rowData) => "******",
      editComponent: (props) => <PasswordField {...props} />,
    },
    { title: "Category", field: "category", type: "text" },
    {
      title: "Picture",
      field: "userPic",
      render: (rowData) => (
        <img
          src={`${ServerURL}/images/${rowData.userpic}`}
          alt={`${rowData.firstname} ${rowData.lastname}`}
          style={{ width: 50, borderRadius: "50%" }}
        />
      ),
      editComponent: (props) => {


        const handleClose = (event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          setOpen(false);
        };

        const handleFileChange = (e) => {
          const file = e.target.files[0];
          setSelectedFile(file);
        };

        const handleSave = async () => {
          if (selectedFile) {
            const formData = new FormData();
            formData.append("id", props.rowData.id);
            formData.append("file", selectedFile);
            const result = await postData(
              "viewer/updateViewer_Profile",
              formData
            );
            if (result) {
              setOpen(true);
              setMessage(result.message);
            }
          } else {
            setOpen(true);
            setMessage(result.message);
          }
        };

        const handleCancel = () => {
          setSelectedFile(null);
        };

        return (
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {selectedFile && (
              <div style={{ marginTop: "2%" }}>
                <ButtonGroup>
                  <Button
                    sx={{ bgcolor: "#0f0c29" }}
                    variant="contained"
                    size="small"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    sx={{ bgcolor: "#0f0c29" }}
                    variant="contained"
                    size="small"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
                <Snackbar
                  open={open}
                  autoHideDuration={5000}
                  onClose={handleClose}
                  message={message}
                />
              </div>
            )}
          </div>
        );
      },
    },
  ]);

  const fetchViewers = async () => {
    try {
      const result = await getData("viewer/fetchViewers");
      setData(result.data); // Assuming setData is defined elsewhere in your component
    } catch (error) {
      console.error("Error fetching viewers:", error);
    }
  };

  useEffect(() => {
    fetchViewers();
  }, []);

  const updateViewerData = async (newData, oldData) => {
    try {
      const response = await postData("viewer/viewerData_Update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        id: oldData.id, // assuming the rowData has 'id' field which is the primary key
        updatedData: newData,
      });

      if (!response) {
        throw new Error("Failed to update data");
      }

      const updatedViewer = await response.json();
      return updatedViewer;
    } catch (error) {
      console.error("Error updating viewer:", error);
      throw error;
    }
  };

  const deleteViewerData = async (oldData) => {
    try {
      const response = await postData("viewer/deleteViewer_Data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        id: oldData.id,
      });

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      const deletedViewer = await response.json();
      return deletedViewer;
    } catch (error) {
      console.error("Error deleting viewer:", error);
      throw error;
    }
  };

  return (
    <MaterialTable
      title="Viewers List"
      columns={columns}
      data={data}
      options={{
        // exportButton: true,
        pageSize: 10, // Set the default number of rows to 10
      }}
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              try {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                await updateViewerData(newData, oldData);
                resolve();
              } catch (error) {
                reject(error);
              }
            }, 1000);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
              await deleteViewerData(oldData);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
}
