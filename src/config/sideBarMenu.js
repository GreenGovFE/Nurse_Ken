import React, { useEffect } from 'react';
import { RiAddCircleFill } from 'react-icons/ri';
import { usePatient } from '../contexts';

import finance from '../assets/images/finance.svg';
import insurance from '../assets/images/Insurance.svg';
import referral from '../assets/images/referral.svg';
import dashboard from '../assets/images/dshb.svg';
import facility from '../assets/images/faclty.svg';
import patient from '../assets/images/pats.svg';

const useNavigationItems = () => {
    const { setPatientId, setPatientInfo, setNurseTypes } = usePatient();

    const resetPatientInfo = () => {
        setPatientInfo({});
        setPatientId('');
    };

    const userInfo = JSON.parse(localStorage.getItem('USER_INFO'))
    const nuresRole = userInfo?.role[0]?.toLowerCase().replace(/\s+/g, '');

    useEffect(() => {
        setNurseTypes(nuresRole === 'vitalnurse' ? 'vital' : 'admin')
    }, [])

    console.log(nuresRole);


    const commonItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: <img src={dashboard} className="icon" alt="Dashboard Icon" />
        },
        {
            title: 'Patient',
            href: '/patients',
            icon: <img src={patient} className="icon" alt="Patient Icon" />
        },
        {
            title: 'Facility',
            href: '/facility',
            icon: <img src={facility} className="icon" alt="Facility Icon" />
        },
        {
            title: 'Referrals',
            href: '/referrals',
            icon: <img src={referral} className="icon" alt="Referrals Icon" />
        },
        {
            title: 'Finance',
            href: '/finance',
            icon: <img src={finance} className="icon" alt="Finance Icon" />
        },
        // {
        //     title: 'Insurance',
        //     href: '/insurance',
        //     icon: <img src={insurance} className="icon" alt="Insurance Icon" />
        // }
    ];

    const vitalNurseItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: <img src={dashboard} className="icon" alt="Dashboard Icon" />
        },
        {
            title: 'Patient',
            href: '/patients',
            icon: <img src={patient} className="icon" alt="Patient Icon" />
        }
    ];

    const addPatientItem = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: <img src={dashboard} className="icon" alt="Dashboard Icon" />
        },
        {
            title: 'Add a Patient',
            href: '/patient-details',
            icon: <RiAddCircleFill className="pointer" style={{ width: '24px', height: '24px', color: '#3C7E2D' }} />
        },
        {
            title: 'Patient',
            href: '/patients',
            icon: <img src={patient} className="icon" alt="Patient Icon" />
        },
    ]

    return nuresRole === 'nurse' ? [...commonItems] : nuresRole === 'vitalnurse' ? vitalNurseItems : addPatientItem;
};

export default useNavigationItems;
