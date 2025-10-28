import React from "react";
import image from "../../assets/images/ConnectHealthPro.png";

const Footer = () => (
  <footer
    className="footer"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      flexWrap: "wrap",
    }}
  >
    <div
      className="footer-inner-left flex flex-v-center space-around"
      style={{ display: "flex", alignItems: "center" }}
    >
      <p style={{ margin: "0" }}>
        <a
          href="https://platform.connecthealthpro.com/Terms-and-Conditions_Consent-Policy_Privacy-Policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "10px" }}
        >
          Terms of Service
        </a>{" "}
        | &nbsp; Copyright &copy;{new Date().getFullYear()} ConnectHealthPro.
        All rights reserved.
      </p>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <span>Powered By:</span>
      <img
        src={image}
        alt="Connected Health Pro Logo"
        style={{ width: "140px", marginLeft: "40px", marginRight: "10px" }}
      />
    </div>
  </footer>
);

export default Footer;
