import React, { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";

import UserAvater from "../../assets/images/user-avater.png";

const Header = ({ history, details = {}, navList = [] }) => {
  const [userPix, setUserPix] = useState("");
  const [imgHasError, setImgHasError] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))

  const handleImgError = () => {
    setUserPix("");
    setImgHasError(true);
  };

  return (
    <header>
      <div className="content header-content space-between flex-v-center">
        <div className="header-left">
          {/* <HeaderSearch placeholder="Search transactions or invoices" /> */}
          <span>{userInfo?.role}</span>
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
                  {userInfo?.role || "nurse"}
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
