import React, { useEffect, useState } from "react";
import TagInputs from "../layouts/TagInputs";
import axios from "axios";
import { get } from "../../utility/fetch";
import { RiDeleteBack2Fill, RiDeleteBinFill } from "react-icons/ri";
import notification from "../../utility/notification";

function HMOTable({ data }) {
  const personalInfo = JSON.parse(sessionStorage.getItem("personalInfo"));

  const [categories, setcategories] = useState('')
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [paymentId, setPaymentId] = useState('')

  useEffect(() => {
    getPaymentHistory()
    getAllCategories()
  }, [])
  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/32/${pageNumber}/10/patient-payment-history`);
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
        name: "Select Nurse",
        value: ""
      });
      setcategories(temp);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };
  

  const getHmo = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/32/${pageNumber}/10/patient-payment-history`);
      console.log(response)

      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const PatientPayment = async () => {
    const payload = {
      patientId: Number(sessionStorage.getItem("patientId")),
      firstName: personalInfo?.firstName,
      lastName: personalInfo?.lastName,
      diagnosis: 'personalInfo?.middleName',
      paymentBreakdowns: paymentBreakdowns,
      userId: personalInfo?.nurseId,

    }
    try {
      const response = await axios.post(`https://edogoverp.com/healthfinanceapi/api/patientpayment`, payload);
      console.log(response)
      setPaymentId(response?.data)
      notification({ message: response?.messages, type: "success" })

    } catch (error) {
      notification({  message: error?.response?.data?.errorData[0], type: "error" })
      console.error('Error fetching payment history:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };

  const UpdatePayment = async () => {
    const payload = {
      patientId: Number(sessionStorage.getItem("patientId")),
      amountPayableBy: personalInfo?.firstName,
      amountOwed: 65000,
      amountPaid: 6500,
      availableBalance: 6000,
      comment: 'No comment',
      userId: personalInfo?.nurseId,
    }

    try {
      const response = await axios.post(`https://edogoverp.com/healthfinanceapi/api/patient-payment/${paymentId}/add-update-payment`, payload);
      console.log(response)
      notification({ message: response?.messages, type: "success" })
      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      notification({ message: error?.message, type: "error" })
      console.error('Error fetching payment history:', error);
      // Handle the error here, such as displaying an error message to the user
    }
  };


  const dataObject = {
    visitStartedOn: "31-11-2060",
    visitEndedOn: "30-2-2060",
    hmoId: 0,
    hmoClass: "string",
    itemName: "string",
    categoryId: 0,
    cost: 0,
    packageBenefitId: 0,
    hmoCover: 0,
    patientId: 0,
    userId: 0
  };
  const initialPaymentBreakdown = {
    visitStartedOn: "05-06-2023",
    visitEndedOn: "09-12-2025",
    hmoId: 2,
    hmoClass: "Gold",
    packageBenefitId: 2,
    itemName: "",
    categoryId: "",
    cost: 0,
    hmoCover: 0,
    duePay: 0,
    patientId: Number(sessionStorage.getItem("patientId")),
    userId: personalInfo?.nurseId
  };

  const [paymentBreakdowns, setPaymentBreakdowns] = useState([initialPaymentBreakdown]);

  const handleInputChange = (index, fieldName, value) => {
    const updatedBreakdowns = [...paymentBreakdowns];
    updatedBreakdowns[index][fieldName] = value;
    setPaymentBreakdowns(updatedBreakdowns);
  };

  const addPaymentBreakdown = () => {
    setPaymentBreakdowns([...paymentBreakdowns, initialPaymentBreakdown]);
  };

  const removePaymentBreakdown = (index) => {
    const updatedBreakdowns = [...paymentBreakdowns];
    updatedBreakdowns.splice(index, 1);
    setPaymentBreakdowns(updatedBreakdowns);
  };

  console.log(paymentBreakdowns, personalInfo);

  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item m-t-40">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Payment Breakdown</th>
              <th>Deposit</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.createdOn).toLocaleDateString()}</td>
                <td>{row.diagnosis}</td>
                <td>
                  <table className="bordered-table-inner">
                    <thead className="border-top-none">
                      <tr className="border-top-none">
                        <th>Item</th>
                        <th>Category</th>
                        <th>Cost</th>
                        <th>HMO Cover</th>
                        <th>Due Pay</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody >
                      {paymentBreakdowns.map((payment, index) => (
                        <tr className="border-top-none" key={index}>
                          <td><TagInputs type="text" value={payment.itemName} onChange={(e) => handleInputChange(index, "itemName", e.target.value)} /></td>
                          <td>
                            <TagInputs type="select" options={categories} onChange={(e) => handleInputChange(index, "categoryId", Number(e.target.value))} />


                          </td>
                          <td><TagInputs type="number" value={payment.cost} onChange={(e) => handleInputChange(index, "cost", Number(e.target.value))} /></td>
                          <td><TagInputs type="number" value={payment.hmoCover} onChange={(e) => handleInputChange(index, "hmoCover", Number(e.target.value))} /></td>
                          <td><TagInputs type="number" value={payment.duePay} onChange={(e) => handleInputChange(index, "duePay", Number(e.target.value))} /></td>
                          <td><span><RiDeleteBinFill className="delete-btn" onClick={() => removePaymentBreakdown(index)} /></span> </td>
                        </tr>
                      ))}
                      <tr>
                        <td>Total Bill</td>
                        <td></td>
                        <td>{paymentBreakdowns.reduce((total, payment) => total + payment.cost, 0)}</td>
                        <td>{paymentBreakdowns.reduce((total, payment) => total + payment.hmoCover, 0)}</td>
                        <td>{paymentBreakdowns.reduce((total, payment) => total + payment.duePay, 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button className="m-t-20 submit-btn col-4" onClick={addPaymentBreakdown}>Add Payment Breakdown</button>
                </td>
                <td>{row.hmoDeposit}</td>
                <td>{row.hmoBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-4 float-right flex space-between">
        <button className="m-t-20 m-r-20 submit-btn" onClick={UpdatePayment}>Update Payment</button>
        <button className="m-t-20 submit-btn" onClick={PatientPayment}>Make Payment</button>
      </div>

    </div>
  );
}

export default HMOTable;
