import  {toast}  from 'react-hot-toast';


const notification = ({
  title,
  message,
  type,
  onRemoval = () => {},
  duration = 5000
}) => {
  try {
    toast(message, {
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      type
    });
  } catch (e) {
    console.log(e);
  }
};

export default notification;
