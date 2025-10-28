import React, { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

import UserAvater from "../../assets/images/user-avater.png";

const Header = ({ history, details = {}, navList = [] }) => {
  const [userPix, setUserPix] = useState("");
  const [imgHasError, setImgHasError] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
  console.log("userInfo", userInfo.role);
  function getRoleTitle(roles) {
    if (!Array.isArray(roles) || roles.length === 0) return "No Role";

    let roleString = "";

    const hasRole = (roleName) => roles.includes(roleName);
 if (hasRole("Doctor")) {
      roleString = "Doctor";
    }
     else if (hasRole("Nurse") && hasRole("checkin")) {
      roleString = "Checkin Nurse";
    }
    // Priority 4: Nurse and Local Admin
    else if (hasRole("Nurse") && hasRole("Local Admin")) {
      roleString = "Admin Nurse";
    }
    else if (hasRole("Pharmacist")) {
      roleString = "Pharmacist";
    }
    // Priority 1: Super Admin or more than 7 roles
   
    // Priority 2: Only one role
    else if (roles.length === 1) {
      roleString = roles[0];
    }
    // Priority 3: Nurse and checkin
    else if (hasRole("Nurse") && hasRole("checkin")) {
      roleString = "Checkin Nurse";
    }
    // Priority 4: Nurse and Local Admin
    else if (hasRole("Nurse") && hasRole("Local Admin")) {
      roleString = "Admin Nurse";
    }
    else if (hasRole("Health Finance Admin")) {
      roleString += " - Admin Manager";
    }
    // Fallback
    else {
      roleString = roles[0]; // default to first role
    }

    // Add "- Admin Manager" if Health Finance Admin is present
   
     if (hasRole("Super Admin") || roles.length > 7) {
      roleString += " - Super Admin";
    }

    return roleString;
  }
  const handleImgError = () => {
    setUserPix("");
    setImgHasError(true);
  };

  return (
    <header>
      <div className="content header-content space-between flex-v-center">
        <div className="header-left">
          {/* <HeaderSearch placeholder="Search transactions or invoices" /> */}
          <span>{getRoleTitle(userInfo?.role)}</span>
        </div>
        <div className="header-right flex flex-v-center">
          <div className="right-item">
            <div
              role="presentation"
              onClick={() => {}}
              className="user-avater-details flex flex-v-center pointer"
            >
              <div className="m-r-5 right-text" style={{ paddingTop: "3px" }}>
                <p className="name">
                  {userInfo?.firstName} {userInfo?.lastName}
                </p>
                <p className="role">
                  {getRoleTitle(userInfo?.role) || "nurse"}
                </p>
              </div>
              <div className="flex">
                <img
                  onError={handleImgError}
                  src={userPix || UserAvater}
                  alt="user avater"
                />
              </div>
              <div className="flex arrow">
                <TiArrowSortedDown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
