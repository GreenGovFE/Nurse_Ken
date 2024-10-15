import React, { useEffect, useState } from "react";

function PaymentHistory({ data }) {
  return (
    <div className="w-100 ">
      <div className="w-100 none-flex-item ">
        <table className="bordered-table">
          <thead className="border-top-none">
            <tr className="border-top-none">
              <th className="center-text">Date</th>
              <th className="center-text">Diagnosis</th>
              <th className="center-text">Payment Status</th>
              
            </tr>
          </thead>

          <tbody className="white-bg view-det-pane">
            {Array.isArray(data) && data?.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row?.createdOn).toLocaleDateString()}</td>
                <td>{row?.diagnosis}</td>
                <td>
                  {Array.isArray(row?.paymentBreakdowns) && row?.paymentBreakdowns.length > 0 ? row?.paymentBreakdowns.map((payment, index) => (
                    <div key={payment?.itemId} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{index + 1}. {payment?.category?.name}</span>
                      <span style={{color: (payment?.status !== 'Paid' && payment?.status !== 'HMO Covered') ? 'red' : 'green', fontWeight: 'bold'}}>{payment?.status}</span>
                    </div>
                  )) : <span>Not Available</span>}
                </td>
                
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default PaymentHistory;
