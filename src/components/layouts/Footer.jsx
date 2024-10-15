import React from "react";


const Footer = () => (

  <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
    <div className="footer-inner-left flex flex-v-center space-around" style={{ display: 'flex', alignItems: 'center' }}>
      <p style={{ margin: '0' }}>
        <a href="https://dms.greenwayhealth.com/my-health-record/tos/terms-of-service.htm" style={{ marginLeft: '10px' }}>Terms of Service</a>  |
        <a href="https://dms.greenwayhealth.com/my-health-record/pp/privacy-policy.htm" style={{ marginLeft: '10px' }}>Privacy Policy</a>
         &nbsp; Copyright 2024 &copy; Greenzone Technologies Limited. All rights reserved.
      </p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>Powered By:</span>
      <img
        src={'greenzone.png'}
        alt="Edsg Logo"
        style={{ width: '140px', marginLeft: '40px', marginRight: '10px', }}
      />
    </div>
  </footer>

);

export default Footer;
