import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import axios from "axios";
import notification from "../../utility/notification";
import UpdatePaymentModal from "../modals/UpdatePayment";

function HMOTableHistory({ data }) {
  const personalInfo = JSON.parse(sessionStorage.getItem("personalInfo"));

  const [categories, setcategories] = useState('')
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [paymentId, setPaymentId] = useState('')
  const [payload, setPayload] = useState({})
  const [viewing, setViewing] = useState({})
  const [totalDuePay, setTotalDuePay] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);

  };



  const selectRecord = (record) => () => {
    console.log(record);
    setViewing(record);
    setIsModalOpen(true);
  };

  useEffect(() => {
    getPaymentHistory()
    getAllCategories()
  }, [])

  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/41/${pageNumber}/10/patient-payment-history`);
      console.log(response)

      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };




  const getAllCategories = async () => {
    try {
      let res = await get(`/patients/get-all-categories`);
      console.log(res);

      let temp = res?.map((item, idx) => {
        return {
          name: item?.name,
          value: parseFloat(item?.id)
        };
      });

      temp?.unshift({
        name: "Select Category",
        value: ""
      });
      setcategories(temp);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };


  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item ">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">Date</th>
              <th className="center-text">Diagnosis</th>
              <th className="center-text">Payment Breakdown</th>
              <th className="center-text">Deposit (₦)</th>
              <th className="center-text">Balance (₦)</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row?.createdOn).toLocaleDateString()}</td>
                <td>{row?.diagnosis}</td>
                <td>
                  {row?.paymentBreakdowns.map((payment, index) => (
                    <div key={payment?.itemId} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{index + 1}. {payment?.itemName}</span>
                      <span>{payment?.cost}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px', fontWeight: 'bold' }}>
                    <span>Total Bill</span>
                    <span>{row?.totalCost}</span>
                  </div>
                </td>
                <td>{row?.hmoDeposit}</td>
                <td>{row?.patientBalance}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      {isModalOpen &&
        <UpdatePaymentModal
          closeModal={closeModal}
          data={viewing}
          paymentId={viewing?.id}
        />
      }
    </div>
  );
}

export default HMOTableHistory;
