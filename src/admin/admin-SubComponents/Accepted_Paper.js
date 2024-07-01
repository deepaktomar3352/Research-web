import { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Avatar } from "@material-ui/core";
import { postData, ServerURL } from "../../services/ServerServices";
import { render } from "@testing-library/react";

export default function Accepted_Paper(props) {
  const [acceptedPapers, setAcceptedPaper] = useState([]);
  const [userData, setUserData] = useState([]);

  console.log("props", props.status);
  const fetchViewers = async () => {
    const result = await postData(
      `admin/fetchAccording_To_Paper_Status_for_admin`,
      {
        paper_status: props.status,
      }
    );
    console.log("result s", result.status);
    setAcceptedPaper(result.papers);
    setUserData(result.users);
  };

  useEffect(() => {
    fetchViewers();
  }, [props.status]);

  const combineData = () => {
    // Combine acceptedPapers and userData into a single array with required fields
    const combinedData = acceptedPapers.map((paper) => {
      const user = userData.find((user) => user.id === paper.submitted_by);
      return {
        ...paper,
        firstname: user ? user.firstname : "",
        lastname: user ? user.lastname : "",
        userpic: user ? user.userpic : "",
        user: user ? user : null, // Optionally include the entire user object
      };
    });
    return combinedData;
  };

  console.log("daassd", combineData());
  const columns = [
    { title: "Paper Title", field: "paper_title" },
    { title: "Research Area", field: "research_area" },
    { title: "Paper Status", field: "paper_status",
      render:(rowData)=><span style={{color:rowData.paper_status==="reject"?"red":"green"}}>{rowData.paper_status}</span>
     },
    {
      title: "Submitted By",
      field: "user",
      render: (rowData) => (
        <div>
          {rowData.firstname} {rowData.lastname}
        </div>
      ),
    },
    {
      title: "User Profile",
      field: "userpic",
      render: (rowData) =>
        rowData.user ? (
          <Avatar
            src={`${ServerURL}/images/${rowData.user.userpic}`}
            alt={`${rowData.user.firstname} ${rowData.user.lastname}`}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        ) : (
          "N/A"
        ),
    },
  ];

  return (
    <MaterialTable
      title="Accepted Papers"
      columns={columns}
      data={combineData()}
      options={{
        exportButton: true,
        pageSize: 10, // Set the default number of rows to 10
      }}
    />
  );
}
