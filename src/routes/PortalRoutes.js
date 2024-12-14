/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { Routes, Route } from 'react-router';
import Dashboard from '../components/pages/Dashboard';
import Patients from '../components/pages/Patients';
import Facility from '../components/pages/Facility';
import CustomerEngagement from '../components/pages/CustomerEngagement';
import PatientDetails from '../components/pages/PatientDetails';
import AuthRoute from './AuthRoute';
import PatientsFinance from '../components/pages/Finance';
import PatientsInsurance from '../components/pages/Pinsurance';
import ReferredPatients from '../components/pages/referrals';
import AddPatients from '../components/pages/AddPatients';
import { useNavigate } from "react-router-dom";
import PatientHMOetails from '../components/pages/PatientHmoDetails';


export default () => {

    return (
        <Routes>
            <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
            <Route path="/patients" element={<AuthRoute><Patients /> </AuthRoute>} />
            <Route path="/facility" element={<AuthRoute><Facility /></AuthRoute>} />
            <Route path="/patient-details" element={<AuthRoute><PatientDetails /></AuthRoute>} />
            <Route path="/patient-hmo-details" element={<AuthRoute><PatientHMOetails/></AuthRoute>} />
            <Route path="/patients/add" element={<AuthRoute><AddPatients /></AuthRoute>} />
            <Route path="/finance" element={<AuthRoute><PatientsFinance /></AuthRoute>} />
            <Route path="/insurance" element={<AuthRoute><PatientsInsurance /></AuthRoute>} />
            <Route path="/customer-engagement" element={<AuthRoute><CustomerEngagement /></AuthRoute>} />
            <Route path="/referrals" element={<AuthRoute><ReferredPatients /></AuthRoute>} />
        </Routes>
    )

};
