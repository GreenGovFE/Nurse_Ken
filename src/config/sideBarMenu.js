import React, { useEffect } from 'react';
import { RiAddCircleFill, RiNotification2Fill } from 'react-icons/ri';
import { usePatient } from '../contexts';

import finance from '../assets/images/finance.svg';
import insurance from '../assets/images/Insurance.svg';
import referral from '../assets/images/referral.svg';
import dashboard from '../assets/images/dshb.svg';
import facility from '../assets/images/faclty.svg';
import patient from '../assets/images/pats.svg';

const useNavigationItems = () => {
    const { setPatientId, setPatientInfo, nurseRoles } = usePatient();

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
            title: 'Birth Record',
            href: '/birth-record',
            icon: <img src={finance} className="icon" alt="Finance Icon" />
        },
        {
            title: 'Antenatal',
            href: '/antenatal',
            icon: <img src={finance} className="icon" alt="Finance Icon" />
        },
        {
            title: 'Notifications',
            href: '/notify',
            icon: <RiNotification2Fill style={{ width: '20px', height: '20px', color: '#3C7E2D' }}/>
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
        
    ];

    if (nurseRoles.includes('nurse') && nurseRoles.includes('checkin')) {
        return [addPatientItem[1], ...commonItems] ;
    }else if (nurseRoles.includes('checkin') && nurseRoles.includes('vitalnurse')) {
        return [addPatientItem[1], ...vitalNurseItems] ;
    }else if (nurseRoles.includes('nurse')) {
        return commonItems;
    }else if (nurseRoles.includes('vitalnurse')) {
        return vitalNurseItems;
    } else {
        return addPatientItem;
    }
};

export default useNavigationItems;
