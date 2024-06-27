import { toast } from 'react-hot-toast';

const notification = ({
  title,
  message,
  type,
  onRemoval = () => {},
  duration = 10000
}) => {
  try {
    let toastOptions = {
      duration: duration,
      position: 'top-center',
      style: {
        border: '1px solid #fff',
        padding: '12px',
        color: '#393939',
      },
      iconTheme: {
        primary: '#FF0000', // Default color
        secondary: '#FFFAEE',
      },
      onClose: onRemoval,
    };

    switch (type) {
      case 'success':
        toastOptions.iconTheme.primary = '#00FF00';
        toast.success(message, toastOptions);
        break;
      case 'error':
        toastOptions.iconTheme.primary = '#FF0000'; 
        toast.error(message, toastOptions);
        break;
      case 'loading':
        toast.loading(message, toastOptions);
        break;
      case 'warning':
        toastOptions.iconTheme.primary = '#FFA500';
        toast(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
        break;
    }
  } catch (e) {
    console.log(e);
  }
};

export default notification;
