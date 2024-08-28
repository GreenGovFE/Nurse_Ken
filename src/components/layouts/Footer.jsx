import React from "react";
import EdsgLogo from "../../assets/images/SidebarLogo.png";


const Footer = () => (
  <footer>
    <div className=" space-between flex-v-center">
      <div className="footer-inner-left flex flex-v-center">
        <img src={EdsgLogo} alt="Edsg Logo" className="brand" style={{width: '150px', height: '46px', marginLeft: '20px'}} />
        <p>2024 Greenzone Technologies Limited</p>
      </div>
    </div>
  </footer>
);

export default Footer;
