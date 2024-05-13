import { useState } from "react";
import { RiFolderTransferFill } from "react-icons/ri";
import LabrequestModal from "../modals/labRequestModal";

function LabsTable({ data }) {
  const [viewing, setViewing] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
   
  };

  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    const formattedDate = dateObject.toISOString().split("T")[0];
    return formattedDate;
  };

  const selectRecord = (record) => () => {
    console.log(record);
    setViewing(record);
    setIsModalOpen(true);
  };

    return (
      <div className="w-100 ">
        <div className="w-100 none-flex-item m-t-40">
          <table className="bordered-table">
            <thead className="border-top-none">
              <tr className="border-top-none">
                <th>Patient's #ID</th>
                <th>Patient's Fullname</th>
                <th>Age</th>
                <th>Diagnosis</th>
                <th>Lab Request</th>
                <th>Date Created</th>
                <th></th>
             </tr>
            </thead>
  
            <tbody className="white-bg view-det-pane">
              {data?.map((row) => (
                <tr key={row?.id}>
                  <td>{row?.patientId}</td>
                  <td>{row?.patientFullName}</td>
                  <td>{row?.age}</td>
                  <td>{row?.diagnosis}</td>
                  <td>{row?.labRequest}</td>
                  <td>{formatDate(row?.createdOn)}</td>
                  <td  onClick ={selectRecord(row)}><img className="hovers pointer" src="/details.png"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen &&
          <LabrequestModal
          closeModal={closeModal}
          record={viewing}
        />
        }
      </div>
    );
  }
  
  export default LabsTable;
  