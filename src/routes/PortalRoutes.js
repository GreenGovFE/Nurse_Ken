/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Routes, Route } from "react-router";
import Dashboard from "../components/pages/Dashboard";
import Patients from "../components/pages/Patients";
import Facility from "../components/pages/Facility";
import CustomerEngagement from "../components/pages/CustomerEngagement";
import PatientDetails from "../components/pages/PatientDetails";
import AuthRoute from "./AuthRoute";
import PatientsFinance from "../components/pages/Finance";
import PatientsInsurance from "../components/pages/Pinsurance";
import ReferredPatients from "../components/pages/referrals";
import AddPatients from "../components/pages/AddPatients";
import { useNavigate } from "react-router-dom";
import PatientHMOetails from "../components/pages/PatientHmoDetails";
import Notify from "../components/pages/notify";
import BirthRecordForm from "../components/pages/Patient/BirthRecordForm/BirthRecordForm";
import AntenatalTable from "../components/pages/Patient/AntenatalTable";
import Antinatal from "../components/Antinatal";
import PatientsAddService from "../components/pages/PatientsAddService";
import AddExtraServices from "../components/pages/Patient/AddExtraServices";

export default () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <AuthRoute>
            <Dashboard />
          </AuthRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <AuthRoute>
            <Patients />{" "}
          </AuthRoute>
        }
      />
      <Route
        path="/facility"
        element={
          <AuthRoute>
            <Facility />
          </AuthRoute>
        }
      />
      <Route
        path="/patient-details"
        element={
          <AuthRoute>
            <PatientDetails />
          </AuthRoute>
        }
      />
      <Route
        path="/patient-hmo-details"
        element={
          <AuthRoute>
            <PatientHMOetails />
          </AuthRoute>
        }
      />
      <Route
        path="/patients/add"
        element={
          <AuthRoute>
            <AddPatients />
          </AuthRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <AuthRoute>
            <PatientsFinance />
          </AuthRoute>
        }
      />
      <Route
        path="/insurance"
        element={
          <AuthRoute>
            <PatientsInsurance />
          </AuthRoute>
        }
      />
      <Route
        path="/customer-engagement"
        element={
          <AuthRoute>
            <CustomerEngagement />
          </AuthRoute>
        }
      />
      <Route
        path="/referrals"
        element={
          <AuthRoute>
            <ReferredPatients />
          </AuthRoute>
        }
      />
      <Route
        path="/notify"
        element={
          <AuthRoute>
            <Notify />
          </AuthRoute>
        }
      />
      <Route
        path="/patient-services"
        element={
          <AuthRoute>
            <PatientsAddService />
          </AuthRoute>
        }
      />
      <Route
        path="/add-patient-services"
        element={
          <AuthRoute>
            <AddExtraServices />
          </AuthRoute>
        }
      />

      <Route
        path="/birth-record"
        element={
          <AuthRoute>
            <BirthRecordForm />
          </AuthRoute>
        }
      />
      <Route
        path="/antenatal"
        element={
          <AuthRoute>
            <AntenatalTable />
          </AuthRoute>
        }
      />
       {/* <Route
        path="/antenatal/patients/patient-details/:id"
        element={
          <AuthRoute>
            <AntenatalTable />
          </AuthRoute>
        }
      /> */}
      {/* doctor/patients/patient-details/5542 */}
      <Route
        path="antenatal-record/:patientId"
        element={
          <AuthRoute>
            <Antinatal />
          </AuthRoute>
        }
      />
    </Routes>
  );
};
