import { createContext, useState } from 'react';

// Context  For Storing User Information
const MyContext = createContext();


// Sample stafpayroll

// {
//     employeeId: 0,
//     baseSalary: 0,
//     totalAllowances: 0,
//     tax: 0,
//     pensionContribution: 0,
//     otherDeductions: 0,
//     netPay: 0,
//     notes: ""
// }

const MyProvider = ({ children }) => {
    // const [payrollData, setPayrollData] = useState({
    //     mdaId: 0,
    //     title: "",
    //     month: null,
    //     year: null,
    //     comment: "",
    //     totalGrossPayment: 0,
    //     totalDeductions: 0,
    //     overallNetPayment: 0,
    //     thirteenthMonth: 0,
    //     cooperativeDeductions: 0,
    //     staffPayroll: [

    //     ]
    // });

    // const [isApprover, setIsApprover] = useState(false);

    // const [isEdit, setIsEdit] = useState(false);

    return (
        <MyContext.Provider value={{}}>
            {children}
        </MyContext.Provider>
    );
};

export { MyProvider, MyContext };