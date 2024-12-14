import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import EdsgLogo from "../../assets/images/SidebarLogo.png";
import useNavigationItems from "../../config/sideBarMenu";
import { usePatient } from "../../contexts";
import Cookies from "js-cookie";

const Sidebar = ({ history }) => {
  const { setPatientId, setPatientInfo, setHmoDetails, setNurseTypes, setPatientName, setDiagnosis } = usePatient();
  const [hamburger, setHamburger] = useState(true);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))
  const nuresRole = userInfo ? userInfo?.role[0]?.toLowerCase().replace(/\s+/g, '') : '';
  const homeLink = Cookies.get('homeLink')

  const ToSupport = () => {
    window.location.href = 'https://greenzonetechnologies.atlassian.net/servicedesk/customer/portals';
  }

  const logout = async () => {
    localStorage.clear();
    sessionStorage.clear();
    Cookies.remove('patientInfo');

    window.location.assign(`${homeLink}`);
    // window.location.assign(`${homeLink}/home`);
  };

  const resetPatientInfo = () => {
    setPatientInfo(null);
    setHmoDetails(null);
    setPatientName(null)
    setPatientId(null)
    setDiagnosis(null)
    Cookies.remove('patientInfo');
    setNurseTypes(nuresRole === 'vitalnurse' ? 'vital' : nuresRole === 'nurse' ? 'admin' : 'checkin')
  };

  const {
    location: { pathname },
  } = history;

  const navigationItems = useNavigationItems();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
    setHamburger(!hamburger);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false);
        setHamburger(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {hamburger && (
        <button className="hamburger-menu" onClick={toggleSidebar}>
          <GiHamburgerMenu size={24} />
        </button>
      )}

      <nav
        className={`page-sidebar ${isSidebarVisible ? "visible" : ""}`}
        ref={sidebarRef}
      >
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
                  navigate={navigate} // Pass navigate prop
                />
              ))}
            <li className="pointer" onClick={logout}>
              <RiLogoutCircleLine className="icon" />
              <span className="title  m-l-20">Log Out</span>

            </li>
            <div style={{ bottom: '0%', right: '30%', position: 'fixed', zIndex: '1000' }}>
              <img onClick={ToSupport} style={{ width: '120px', height: '120px', cursor: 'pointer' }} alt='support' src="/Support.svg"></img>
            </div>
          </ul>
        </div>
      </nav>
    </>
  );
};

const MenuItem = ({ item: { title, href, icon, children, onClick }, pathname, resetPatientInfo, navigate }) => {
  const [isShowingSub, setIsShowingSub] = useState(false);

  const handleClick = () => {
    resetPatientInfo();
    if (onClick) onClick();
    navigate(href); // Navigate to the route
  };

  return (
    <>
      <li
        className={`${pathname === href ? "active" : ""} pointer`}
        onClick={handleClick} // Move the click handler to <li>
      >
        {icon}
        {children ? (
          <>
            <span className="has-sub-menu">
              <span className="title  m-l-20">{title}</span>
            </span>
            {children && (
              <IoIosArrowBack
                className={`${isShowingSub ? "open" : ""} arrow`}
              />
            )}
          </>
        ) : (
          <span>
            <span className="title m-l-20">{title}</span>
          </span>
        )}
      </li>
      {children && isShowingSub && (
        <ul className={`${isShowingSub ? "show" : ""} sub-menu`}>
          {children &&
            children.map((sub) => (
              <li
                className={`${pathname === sub.href ? "active" : ""} pointer`}
                key={sub.title}
                onClick={() => navigate(sub.href)}
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
