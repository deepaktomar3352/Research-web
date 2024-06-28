import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { getData, postData, ServerURL } from "../../services/ServerServices";
import { Avatar } from "@mui/material";

export default function Users_list() {
  const [data, setData] = useState([]);

  const fetchViewers = async () => {
    try {
      const result = await getData("users/user_info");
      setData(result.users); 
    } catch (error) {
      console.error("Error fetching viewers:", error);
    }
  };
  useEffect(() => {
    fetchViewers();
  }, []);

  return (
    <MaterialTable
      title="Users List"
      columns={[
        { title: "First Name", field: "firstname" },
        { title: "Last Name", field: "lastname" },
        { title: "Email", field: "email" },
        {
          title: "Picture",
          field: "userpic",
          render: (rowData) => (
            <Avatar
              src={`${ServerURL}/images/${rowData.userpic}`}
              alt={`${rowData.firstname} ${rowData.lastname}`}
              style={{ width: 50, height: 50, borderRadius: "50%",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat: "no-repeat"}}
            />
          ),
        },
      ]}
      data={data}
      options={{
        exportButton: true,
      }}
    />
  );
}
