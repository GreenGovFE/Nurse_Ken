
export const logout = async () => {
  const link = localStorage.getItem('homeLink')
  sessionStorage.removeItem('token');
  localStorage.removeItem('USER_INFO');
  localStorage.removeItem('homeLink');
  localStorage.removeItem('LOGIN_TIME');
 

  window.location.assign('/');
};
