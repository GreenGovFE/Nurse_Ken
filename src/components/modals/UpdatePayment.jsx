import React, { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import InputField from '../UI/InputField';
import TextArea from '../UI/TextArea';
import { formatDate } from "../../utility/general";
import TagInputs from '../layouts/TagInputs';
import { get, post } from '../../utility/fetch';
import notification from '../../utility/notification';
import axios from 'axios';

function UpdatePaymentModal({ closeModal, data, paymentId }) {

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const personalInfo = JSON.parse(sessionStorage.getItem("personalInfo"));

    const [categories, setCategories] = useState('');
    const [paymentHistory, setPaymentHistory] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [payload, setPayload] = useState({});
    const [totalDuePay, setTotalDuePay] = useState(data.hmoTotalDuePay || 0);
    const [hmo, setHmo] = useState({});

    useEffect(() => {
        getAllCategories();
    }, []);



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


    const UpdatePayment = async () => {
        const balance = data?.hmoTotalDuePay - Number(payload?.amountPaid)
        const Payload = {
            patientId: Number(sessionStorage.getItem("patientId")),
            amountPayableBy: personalInfo?.firstName,
            amountOwed: data?.hmoTotalDuePay,
            amountPaid: Number(payload?.amountPaid),
            availableBalance: Math.abs(balance),
            comment: 'No comment',
            userId: Number(sessionStorage.getItem('userId')),
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


    const handleChange = (fieldName, value) => {
        if (value > data?.patientBalance && fieldName === 'amountPaid') {
            notification({ message: "Can't deposit more than amount to be paid", type: "error" });
            return
        } else {
            setPayload((prevValues) => ({
                ...prevValues,
                [fieldName]: value
            }));
        }
    };



    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         setCurrentDateTime(new Date());
    //     }, 1000);

    //     // Cleanup function to clear the interval when the component unmounts
    //     return () => clearInterval(intervalId);
    // }, []);




    const formattedDate = currentDateTime.toLocaleDateString();
    const formattedTime = currentDateTime.toLocaleTimeString();

    const formatDate = (timestamp) => {
        const dateObject = new Date(timestamp);
        const formattedDate = dateObject.toISOString().split("T")[0];
        return formattedDate;
    };

    return (
        <div className='modal'>
            <div className="modal-contents">
                <span className="close m-b-20" onClick={closeModal}>&times;</span>
                <div className="flex space-between">
                    <div className="flex space-between flex-v-center m-t-20 col-3">
                        <p>Update Payment</p>
                    </div>
                    {/* <div className="flex space-between flex-v-center m-t-20 col-4">
                        <p>Time: {formattedTime}</p>
                    </div> */}
                </div>
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
                                <tr key={data?.id}>
                                    <td>
                                        {/* <TagInputs label='Start Date' type="date" onChange={(e) => handleChange("visitStartedOn", e.target.value)} />
                  <TagInputs label='End Date' type="date" onChange={(e) => handleChange("visitEndedOn", e.target.value)} /> */}
                                        {new Date(data?.createdOn).toLocaleDateString()}
                                    </td>
                                    <td><TagInputs value={data?.diagnosis} disabled type="textArea" /></td>
                                    <td>
                                        <table className="bordered-table-inner">
                                            <thead className="border-top-none">
                                                <tr className="border-top-none">
                                                    <th>Item</th>
                                                    <th>Cost (₦)</th>
                                                    <th>HMO Cover (₦)</th>
                                                    <th>Due Pay (₦)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data?.paymentBreakdowns.map((payment, index) => (
                                                    <tr className="border-top-none" key={index}>
                                                        <td><TagInputs type="text" value={payment?.itemName} disabled /></td>

                                                        {/* <td>
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
                            })} onChange={(e) => handleChange("package", e.target.value)} />
                          </td> */}
                                                        <td><TagInputs variation={true} value={payment?.cost || 0} disabled onChange={(e) => handleChange("cost", Number(e.target.value))} /></td>
                                                        <td><TagInputs variation={true} value={payment?.hmoCover} disabled onChange={(e) => handleChange("hmoCover", Number(e.target.value))} /></td>
                                                        <td>{(payment?.duePay)}</td>
                                                        {/* <td><span><RiDeleteBinFill className="delete-btn" onClick={() => removePaymentBreakdown(index)} /></span> </td> */}
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td>Total Bill</td>
                                                    <td>{data?.paymentBreakdowns.reduce((total, payment) => total + payment?.cost, 0)}</td>
                                                    <td>{data?.paymentBreakdowns.reduce((total, payment) => total + payment?.hmoCover, 0)}</td>
                                                    <td>{data?.paymentBreakdowns.reduce((total, payment) => total + payment?.duePay, 0)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td><TagInputs variation={true} value={payload.amountPaid} onChange={(e) => handleChange("amountPaid", e.target.value)} /></td>
                                    <td>{(data?.patientBalance - payload.amountPaid) === 0 ? 0 : (data?.patientBalance - payload.amountPaid)  || data?.patientBalance }</td>

                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-4 float-right flex">
                        <button className="m-t-20 m-r-20 submit-btn" disabled={!paymentId} onClick={UpdatePayment}>Update Payment</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UpdatePaymentModal;