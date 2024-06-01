import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import EdsgLogo from "../../assets/images/SidebarLogo.png";
import { logout } from "../../utility/auth";
import useNavigationItems from "../../config/sideBarMenu";
import { usePatient } from "../../contexts";

const Sidebar = ({ history }) => {
  const { setPatientId, setPatientInfo } = usePatient();

  const resetPatientInfo = () => {
    setPatientInfo({});
    setPatientId('');
  };

  const {
    location: { pathname },
  } = history;

  const navigationItems = useNavigationItems();

  return (
    <nav className="page-sidebar">
      <div className="sidebar-header">
        <img src={EdsgLogo} alt="logo" className="brand" width="150" />
      </div>

      <div className="sidebar-menu">
        <ul className="menu-items">
          {navigationItems &&
            navigationItems.map((item) => (
              <MenuItem
                key={item.title}
                item={item}
                pathname={pathname}
                resetPatientInfo={resetPatientInfo}
              />
            ))}
          <li onClick={logout}>
            <RiLogoutCircleLine className="icon" />
            <Link className="has-sub-menu">
              <span className="title">Log Out</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const MenuItem = ({ item: { title, href, icon, children, onClick }, pathname, resetPatientInfo }) => {
  const [isShowingSub, setIsShowingSub] = useState(false);

  const handleClick = () => {
    resetPatientInfo();
    if (onClick) onClick(); // Execute any specific onClick logic from navigation item
  };

  return (
    <>
      <li className={`${pathname === href ? "active" : ""}`}>
        {icon}
        {children ? (
          <>
            <Link
              onClick={() => {
                setIsShowingSub(!isShowingSub);
                handleClick();
              }}
              className="has-sub-menu"
            >
              <span className="title">{title}</span>
            </Link>
            {children && (
              <IoIosArrowBack
                className={`${isShowingSub ? "open" : ""} arrow`}
              />
            )}
          </>
        ) : (
          <Link to={href} onClick={handleClick}>
            <span className="title">{title}</span>
          </Link>
        )}
      </li>
      {children && isShowingSub && (
        <ul className={`${isShowingSub ? "show" : ""} sub-menu`}>
          {children &&
            children.map((sub) => (
              <li
                className={`${pathname === sub.href ? "active" : ""}`}
                key={sub.title}
              >
                <Link to={sub.href} onClick={resetPatientInfo}>
                  {sub.title}
                </Link>
              </li>
            ))}
        </ul>
      )}
    </>
  );
};

export default Sidebar;
