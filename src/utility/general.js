export const toggleScroll = () => {
  const overlays = document.querySelectorAll('.overlay');

  if (overlays.length > 0) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
};

export const convertImgToBase64 = (inputFile) => {
  if (inputFile === undefined) return '';
  const file = new FileReader();

  return new Promise((resolve, reject) => {
    file.onerror = () => {
      file.abort();
      reject(new DOMException('Problem parsing input file.'));
    };

    file.onload = () => {
      resolve(file.result);
    };
    file.readAsDataURL(inputFile);
  });
};

export const formatDate = (input) => {
  const date = new Date(input);

  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}-${month}-${year}`;

}

export const months = 
 
    [
      {
        value:0,
        label:"January"
      },
      {
        value:1,
        label:"February"
      },
      {
        value:2,
        label:"March"
      },
      {
        value:3,
        label:"April"
      },
      {
        value:4,
        label:"May"
      },
      {
        value:5,
        label:"June"
      },
      {
        value:6,
        label:"July"
      },
      {
        value:7,
        label:"August"
      },
      {
        value:8,
        label:"September"
      },
      {
        value:9,
        label:"October"
      },
      {
        value:10,
        label:"November"
      },
      {
        value:11,
        label:"December"
      },
      
    ]

export const years = [
  {
    value: 2023,
    label: "2023"
  }
]

export const numberWithCommas = (x) => {
  if (String(x).includes(',')) {
    return String(x).replace(/,/g, '')?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  else {
    return x?.toString()?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }
}

export  const stripCommas = (val) => {
  let num = String(val).replace(/,/g, '')
  return parseFloat(num);
}

export const formatFileUrl = (path) => `${process.env.REACT_APP_BACKEND_URL}/${path}`;

export const getStatus = (data) => {
  if (data.statusDetails === "Unasigned") {
      return "Saved"
  }
  if (data.statusDetails === "Pending") {
      return `Currently with ${data.lastApprover} - (${data.pendingOffice})`
  }
  if (data.statusDetails === "ApprovalCompleted") {
      return `Approved by ${data.lastApprover}`
  }
  if (data.statusDetails === "Declined") {
      return `Declined by ${data.lastApprover}`
  }
  return ""
}

export function timeAgo(dateTime) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateTime) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    const diffInDays = Math.floor(diffInSeconds / 86400);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
}

export  const checkIfAppointmentPassed = (appointmentId , Appointments) => {
  const selectedAppointment = Appointments?.find(
    (item) => item.value === parseFloat(appointmentId)
  );

  if (!selectedAppointment || !selectedAppointment.name) return;
  const appointmentDateString = selectedAppointment.name.split(" at ")[0];
  const appointmentTimeString = selectedAppointment.name.split(" at ")[1].split(" with ")[0];

  // Combine date and time into a single string
  const appointmentDateTimeString = `${appointmentDateString} ${appointmentTimeString}`;

  // Parse the combined string into a Date object
  const appointmentDateTime = new Date(appointmentDateTimeString);

  // Add 30 minutes to the appointment time
  const updatedAppointmentTime = new Date(appointmentDateTime.getTime() + 30 * 60000);

  // Get the current time
  const currentDateTime = new Date();

  // Check if the current time is past the updated appointment time (+30 mins)
  if (currentDateTime > updatedAppointmentTime) {
    return true; // Appointment has passed, including the 30-minute buffer
  }

  return false; 
};