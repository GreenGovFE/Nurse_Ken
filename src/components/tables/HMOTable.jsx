import React, { useEffect, useState } from "react";
import TagInputs from "../layouts/TagInputs";
import axios from "axios";
import { get } from "../../utility/fetch";
import { RiDeleteBack2Fill, RiDeleteBinFill } from "react-icons/ri";
import notification from "../../utility/notification";

function HMOTable({ data, hmoPackages, hmoId, hmoClass }) {
  const personalInfo = JSON.parse(sessionStorage.getItem("personalInfo"));

  const [categories, setCategories] = useState('');
  const [paymentHistory, setPaymentHistory] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [paymentId, setPaymentId] = useState('');
  const [payload, setPayload] = useState({});
  const [totalDuePay, setTotalDuePay] = useState(0);
  const [hmo, setHmo] = useState({});

  useEffect(() => {
    getPaymentHistory();
    getAllCategories();
  }, []);

  const getPaymentHistory = async () => {
    try {
      const response = await axios.get(`https://edogoverp.com/healthfinanceapi/api/patientpayment/list/patient/41/${pageNumber}/10/patient-payment-history`);
      console.log(response);

      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      console.error('Error fetching payment history:', error);
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
      setCategories(temp);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const PatientPayment = async () => {
    const Payload = {
      patientId: Number(sessionStorage.getItem("patientId")),
      firstName: personalInfo?.firstName,
      lastName: personalInfo?.lastName,
      diagnosis: payload.diagnosis,
      paymentBreakdowns: paymentBreakdowns,
      userId: personalInfo?.nurseId,
    };

    try {
      const response = await axios.post(`https://edogoverp.com/healthfinanceapi/api/patientpayment`, Payload);
      console.log(response);
      setPaymentId(response?.data);
      notification({ message: response?.messages, type: "success" });
    } catch (error) {
      notification({ message: error?.response?.data?.errorData[0], type: "error" });
      console.error('Error making payment:', error);
    }
  };

  const UpdatePayment = async () => {
    const Payload = {
      patientId: Number(sessionStorage.getItem("patientId")),
      amountPayableBy: personalInfo?.firstName,
      amountOwed: 65000,
      amountPaid: 6500,
      availableBalance: 6000,
      comment: 'No comment',
      userId: personalInfo?.nurseId,
    };

    try {
      const response = await axios.post(`https://edogoverp.com/healthfinanceapi/api/patient-payment/${paymentId}/add-update-payment`, Payload);
      console.log(response);
      notification({ message: response?.messages, type: "success" });
      setPaymentHistory(response?.data?.resultList);
    } catch (error) {
      notification({ message: error?.message, type: "error" });
      console.error('Error updating payment:', error);
    }
  };

  const initialPaymentBreakdown = {
    visitStartedOn: payload?.visitStartedOn,
    visitEndedOn: payload?.visitEndedOn,
    hmoId: hmoId,
    hmoClass: hmoClass,
    packageBenefitId: 0,
    itemName: "",
    categoryId: 0 ,
    cost: 0,
    baseCost: 0,
    hmoCover: 0,
    duePay: 0,
    package: {},
    qty: 1,
    patientId: Number(sessionStorage.getItem("patientId")),
    userId: personalInfo?.nurseId
  };

  const [paymentBreakdowns, setPaymentBreakdowns] = useState([initialPaymentBreakdown]);

  const handleInputChange = (index, fieldName, value) => {
    const updatedBreakdowns = [...paymentBreakdowns];

    if (fieldName === "package") {
      const parsedValue = JSON.parse(value);
      const { id, packageId, limitAmount, categoryId } = parsedValue;
      updatedBreakdowns[index].packageBenefitId = packageId;
      updatedBreakdowns[index].hmoCover = limitAmount;
      updatedBreakdowns[index].categoryId = categoryId;
    }else if((fieldName === "cost")){
      updatedBreakdowns[index].baseCost = value;
      updatedBreakdowns[index][fieldName] = value;
    }else if((fieldName === "qty")){
      if((value < 1)){
        notification({ message: "Quantity can't be less than 1", type: "error" });
        return
      }else{
        updatedBreakdowns[index][fieldName] = value;
      }
    }
     else {
      updatedBreakdowns[index][fieldName] = value;
    }

    const baseCost = updatedBreakdowns[index].baseCost || 0;
    const hmoCover = updatedBreakdowns[index].hmoCover || 0;
    const qty = updatedBreakdowns[index].qty || 1;
    let cost = qty * baseCost;

    let duePay = cost - hmoCover;
    duePay = Math.max(duePay, 0);

    updatedBreakdowns[index].cost = cost;
    updatedBreakdowns[index].duePay = duePay;
    updatedBreakdowns[index].hmoClass = hmoClass;
    updatedBreakdowns[index].hmoId = hmoId;
    updatedBreakdowns[index].visitStartedOn = payload?.visitStartedOn;
    updatedBreakdowns[index].visitEndedOn = payload?.visitEndedOn;
    setPaymentBreakdowns(updatedBreakdowns);

    const newTotalDuePay = updatedBreakdowns.reduce((total, payment) => {
      return total + (payment?.duePay || 0);
    }, 0);
    setTotalDuePay(newTotalDuePay);
  };

  const handleChange = (fieldName, value) => {
    if (value > totalDuePay && fieldName === 'deposit') {
      notification({ message: "Can't deposit more than amount to be paid", type: "error" });
      return
    }else{
      setPayload((prevValues) => ({
        ...prevValues,
        [fieldName]: value
      }));
    }
  };

  const addPaymentBreakdown = () => {
    setPaymentBreakdowns([...paymentBreakdowns, initialPaymentBreakdown]);
  };

  const removePaymentBreakdown = (index) => {
    const updatedBreakdowns = [...paymentBreakdowns];
    updatedBreakdowns.splice(index, 1);
    setPaymentBreakdowns(updatedBreakdowns);
  };

  console.log(paymentBreakdowns, hmoId, hmoClass, payload);

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
            {Array.isArray(data) && data.map((row) => (
              <tr key={row.id}>
                <td>
                  <TagInputs label='Start Date' type="date" onChange={(e) => handleChange("visitStartedOn", e.target.value)} />
                  <TagInputs label='End Date' type="date" onChange={(e) => handleChange("visitEndedOn", e.target.value)} />
                </td>
                <td><TagInputs type="textArea" onChange={(e) => handleChange("diagnosis", e.target.value)} /></td>
                <td>
                  <table className="bordered-table-inner">
                    <thead className="border-top-none">
                      <tr className="border-top-none">
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Category</th>
                        <th>HMO Benefit</th>
                        <th>Cost (₦)</th>
                        <th>HMO Cover (₦)</th>
                        <th>Due Pay (₦)</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentBreakdowns.map((payment, index) => (
                        <tr className="border-top-none" key={index}>
                          <td><TagInputs type="text" value={payment?.itemName} onChange={(e) => handleInputChange(index, "itemName", e.target.value)} /></td>
                          <td><TagInputs variation={true} value={payment?.qty} onChange={(e) => handleInputChange(index, "qty", Number(e.target.value))} /></td>
                          <td>
                            <TagInputs type="select" options={categories} onChange={(e) => handleInputChange(index, "categoryId", Number(e.target.value))} />
                          </td>
                          <td>
                            <TagInputs type="select" options={hmoPackages?.map((item, idx) => {
                              return {
                                name: item?.benefitProvision,
                                value: JSON.stringify({
                                  id: item.id,
                                  packageId: item.packageId,
                                  limitAmount: item.limitAmount,
                                  categoryId: item.categoryId,
                                }),
                              };
                            })} onChange={(e) => handleInputChange(index, "package", e.target.value)} />
                          </td>
                          <td><TagInputs variation={true} value={payment?.cost || 0} onChange={(e) => handleInputChange(index, "cost", Number(e.target.value))} /></td>
                          <td><TagInputs variation={true} value={payment?.hmoCover} onChange={(e) => handleInputChange(index, "hmoCover", Number(e.target.value))} /></td>
                          <td>{(payment?.duePay)}</td>
                          <td><span><RiDeleteBinFill className="delete-btn" onClick={() => removePaymentBreakdown(index)} /></span> </td>
                        </tr>
                      ))}
                      <tr>
                        <td>Total Bill</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{paymentBreakdowns.reduce((total, payment) => total + payment?.cost, 0)}</td>
                        <td>{paymentBreakdowns.reduce((total, payment) => total + payment?.hmoCover, 0)}</td>
                        <td>{paymentBreakdowns.reduce((total, payment) => total + payment?.duePay, 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button className="m-t-20 submit-btn col-4" onClick={addPaymentBreakdown}>Add Item</button>
                </td>
                <td><TagInputs variation={true} value={payload.deposit} onChange={(e) => handleChange("deposit", e.target.value)} /></td>
                {/* <td>{Math.abs(totalDuePay - payload.deposit) || 0}</td> */}
                <td>{(totalDuePay - payload.deposit) === 0 ? 0 : (totalDuePay - payload.deposit)  || totalDuePay }</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-4 float-right flex">
        <button className="m-t-20 submit-btn m-b-40" onClick={PatientPayment}>Make Payment</button>
      </div>
    </div>
  );
}

export default HMOTable;
