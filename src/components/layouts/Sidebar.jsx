import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import EdsgLogo from "../../assets/images/SidebarLogo.png";
import { AiOutlineHome } from "react-icons/ai";
import { logout } from "../../utility/auth";
// import { logout } from "../../utility/auth";

const Sidebar = ({ history, menuList }) => {
  const {
    location: { pathname },
  } = history;

  return (
    <nav className="page-sidebar">
      <div className="sidebar-header">
        <img src={EdsgLogo} alt="logo" className="brand" width="150" />
      </div>

      <div className="sidebar-menu">
        <ul className="menu-items">
          {/* <li>
            <AiOutlineHome className="icon" />
            <Link onClick={logout} className="has-sub-menu">
              <span className="title">Home</span>
            </Link>
          </li> */}
          {menuList &&
            menuList.map((item) => (
              <MenuItem props={item} pathname={pathname} key={item.title} />
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

const MenuItem = ({ props: { title, href, icon, children }, pathname }) => {
  const [isShowingSub, setIsShowingSub] = useState(false);

  return (
    <>
      <li className={`${pathname === href ? "active" : ""}`}>
        {icon}
        {children ? (
          <>
            <Link
              onClick={() => setIsShowingSub(!isShowingSub)}
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
          <Link to={href}>
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
                <Link to={sub.href}>{sub.title}</Link>
              </li>
            ))}
        </ul>
      )}
    </>
  );
};

export default Sidebar;
