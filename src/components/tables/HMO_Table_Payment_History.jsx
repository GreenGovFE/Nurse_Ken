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

  const updatePayment = async () => {
    const Payload = {
      patientId: Number(sessionStorage.getItem("patientId")),
      amountPayableBy: personalInfo?.firstName,
      amountOwed: 65000,
      amountPaid: 6500,
      availableBalance: 6000,
      comment: 'No comment',
      userId: personalInfo?.nurseId,
    }

    try {
      const response = await axios.post(`https://edogoverp.com/healthfinanceapi/api/patient-payment/${paymentId}/add-update-payment`, Payload);
      console.log(response)
      notification({ message: response?.messages, type: "success" })
      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      notification({ message: error?.message, type: "error" })
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
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Payment Breakdown</th>
              <th>Deposit (₦)</th>
              <th>Balance (₦)</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row) => (
              <tr className="hovers pointer" onClick={selectRecord(row)} key={row?.id}>
                <td>{new Date(row?.createdOn).toLocaleDateString()}</td>
                <td>{row?.diagnosis}</td>
                <td>
                  <table className="bordered-table-inner">
                    <thead className="border-top-none">
                      <tr >
                        <th>Item</th>
                        <th>Category</th>
                        <th>Cost (₦)</th>
                        <th>HMO Cover (₦)</th>
                        <th>Due Pay (₦)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row?.paymentBreakdowns.map((payment) => (
                        <tr key={payment?.itemId}>
                          <td>{payment?.itemName}</td>
                          <td>{payment?.categoryName}</td>
                          <td>{payment?.cost}</td>
                          <td>{payment?.hmoCover}</td>
                          <td>{payment?.duePay}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>Total Bill</td>
                        <td></td>
                        <td>{row?.totalCost}</td>
                        <td>{row?.totalHMOCover}</td>
                        <td>{row?.hmoTotalDuePay}</td>
                      </tr>
                    </tbody>
                  </table>
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
