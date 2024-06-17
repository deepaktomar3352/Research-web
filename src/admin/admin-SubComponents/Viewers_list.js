import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { getData, postData, ServerURL } from "../../services/ServerServices";

export default function Viewers_list() {
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
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
    { title: "Category", field: "category", type: "text" },
    {
      title: "Picture",
      field: "userPic",
      render: (rowData) => (
        <img
          src={`${ServerURL}/images/${rowData.userpic}`}
          alt={`${rowData.firstname} ${rowData.lastname}`}
          style={{ width: 50,height:50, borderRadius: "50%" }}
          />
      ),
      // editComponent: (props) => (
      //   <input
      //     type="file"
      //     accept="image/*"
      //     onChange={(e) => {
      //       const file = e.target.files[0];
      //       const reader = new FileReader();
      //       reader.onloadend = () => {
            
      //         uploadImage(file).then((newImageUrl) => {
      //           props.onChange(newImageUrl);
      //         });
      //       };
      //       if (file) {
      //         reader.readAsDataURL(file);
      //       }
      //     }}
      //   />
      // ),
      editable:"never"
    },
  ]);
  console.log("updted data", updateData);
  const fetchViewers = async () => {
    try {
      const result = await getData("viewer/fetchViewers");
      setData(result.data); // Assuming setData is defined elsewhere in your component
    } catch (error) {
      console.error("Error fetching viewers:", error);
    }
  };
  console.log("viewrs list", data);
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
      editable={{
        // onRowAdd: (newData) =>
        //   new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //       setData([...data, newData]);

        //       resolve();
        //     }, 1000);
        //   }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(async () => {
              try {
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                updateViewerData(newData, oldData);
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
              deleteViewerData(oldData);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
}
