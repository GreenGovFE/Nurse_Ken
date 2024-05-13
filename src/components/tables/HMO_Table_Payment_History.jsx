import React from "react";

function HMOTableHistory({ data }) {
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
            {Array.isArray(data) && data?.map((row) => (
              <tr key={row?.id}>
                <td>{new Date(row?.createdOn).toLocaleDateString()}</td>
                <td>{row?.diagnosis}</td>
                <td>
                  <table className="bordered-table-inner">
                    <thead className="border-top-none">
                      <tr >
                        <th>Item</th>
                        <th>Category</th>
                        <th>Cost</th>
                        <th>HMO Cover</th>
                        <th>Due Pay</th>
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
                <td>{row?.hmoBalance}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default HMOTableHistory;
