import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import EdsgLogo from "../../assets/images/SidebarLogo.png";
import useNavigationItems from "../../config/sideBarMenu";
import { usePatient } from "../../contexts";
import Cookies from "js-cookie";

const Sidebar = () => {
  const { setPatientId, setPatientInfo, setHmoDetails, setPatientName, setDiagnosis, nurseRoles } = usePatient();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const homeLink = Cookies.get("homeLink");

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetPatientInfo = () => {
    setPatientInfo(null);
    setHmoDetails(null);
    setPatientName(null);
    setPatientId(null);
    setDiagnosis(null);
    localStorage.removeItem("from");
    Cookies.remove("patientInfo");
    Cookies.remove("patientName");
    Cookies.remove('patientId')
  };

  const handleMenuItemClick = (title, href) => {
    if (title === "Add a Patient") {
      localStorage.setItem("showAddPatientTabs", "true");
    } else {
      localStorage.removeItem("showAddPatientTabs");
    }
    resetPatientInfo();
    navigate(href);
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove("patientInfo");
    Cookies.remove("homeLink");
    window.location.assign(homeLink);
  };

  const handleSupport = () => {
    window.location.href = "https://greenzonetechnologies.atlassian.net/servicedesk/customer/portals";
  };

  const navigationItems = useNavigationItems();

  return (
    <>
      {!isSidebarVisible && (
        <button className="hamburger-menu" onClick={toggleSidebar}>
          <GiHamburgerMenu size={24} />
        </button>
      )}
      <nav className={`page-sidebar ${isSidebarVisible ? "visible" : ""}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <img src={EdsgLogo} alt="logo" className="brand" width="150" />
        </div>
        <div className="sidebar-menu">
          <ul className="menu-items">
            {navigationItems.map((item) => (
              <MenuItem
                key={item.title}
                item={item}
                pathname={pathname}
                onMenuItemClick={handleMenuItemClick}
              />
            ))}
            <li className="pointer" onClick={logout}>
              <RiLogoutCircleLine className="icon" />
              <span className="title m-l-20">Log Out</span>
            </li>
            <div style={{ position: "fixed", bottom: "0%", right: "30%", zIndex: 1000 }}>
              <img
                onClick={handleSupport}
                style={{ width: "120px", height: "120px", cursor: "pointer" }}
                alt="support"
                src="/Support.svg"
              />
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
};

const MenuItem = ({ item: { title, href, icon, children }, pathname, onMenuItemClick }) => {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const handleClick = () => {
    onMenuItemClick(title, href);
  };

  const handleSubItemClick = (sub) => {
    onMenuItemClick(sub.title, sub.href);
  };

  return (
    <>
      <li className={`${pathname === href ? "active" : ""} pointer`} onClick={handleClick}>
        {icon}
        <span className="title m-l-20">{title}</span>
        {children && (
          <IoIosArrowBack
            className={`${showSubMenu ? "open" : ""} arrow`}
            onClick={(e) => {
              e.stopPropagation();
              setShowSubMenu((prev) => !prev);
            }}
          />
        )}
      </li>
      {children && showSubMenu && (
        <ul className="sub-menu show">
          {children.map((sub) => (
            <li
              key={sub.title}
              className={`${pathname === sub.href ? "active" : ""} pointer`}
              onClick={() => handleSubItemClick(sub)}
            >
              {sub.title}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Sidebar;
