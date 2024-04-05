/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

//import { RiBarChartFill, RiHeartPulseLine, RiHotelBedFill, RiHealthBookLine } from 'react-icons/ri';
import finance from '../assets/images/finance.svg'
import insurance from '../assets/images/Insurance.svg'
import referral from '../assets/images/referral.svg'
import dashboard from '../assets/images/dshb.svg'
//import logout from '../assets/images/log out.svg'
import facility from '../assets/images/faclty.svg'
import Customer from '../assets/images/cus eng.svg'
import patient from '../assets/images/pats.svg'



// import { BiEnvelope } from 'react-icons/bi';
// import { HiOutlineUserAdd } from 'react-icons/hi';
// import { CgUserList } from 'react-icons/cg';

export default [
    { title: 'Dashboard', href: '/dashboard', icon: <img src={dashboard}  className="icon"/> },
    { title: 'Patient', href: '/patients', icon: <img src={patient}  className="icon"/> },
    { title: 'Facility', href: '/facility', icon: <img src={facility}  className="icon"/> },
    { title: 'Referrals', href: '/referrals', icon: <img src={referral}  className="icon"/>},
    { title: 'Finance', href: '/finance', icon: <img src={finance}  className="icon"/>},
    { title: 'Insurance', href: '/insurance', icon:<img src={insurance}  className="icon"/>  },
    { title: 'Customer Engagement', href: '/customer-engagement', icon: <img src={Customer}  className="icon"/>},


];
