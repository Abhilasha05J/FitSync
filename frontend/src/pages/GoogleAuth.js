// import React from 'react';
// import { GoogleLogin } from '@react-oauth/google';
// import {jwtDecode} from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { handleSuccess as showToastSuccess, handleError as showToastError } from '../utils';

// function GoogleAuth() {
//   const navigate = useNavigate();

//   const handleSuccess = (credentialResponse) => {
//     try {
//       const details = jwtDecode(credentialResponse.credential);
//       const userData = {
//         token: credentialResponse.credential,
//         picture: details.picture,
//         name: details.name,
//         email: details.email,
//       };

//       console.log('User Details:', userData);
//       // Store in localStorage for persistence
//       localStorage.setItem('token', userData.token);
//       localStorage.setItem('loggedInUser', userData.name);
//       localStorage.setItem('userEmail', userData.email);
//       showToastSuccess('Login successful');
//       navigate('/userdashboard'); // Redirect to dashboard
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       showToastError('Login failed. Please try again.');
//     }
//   };

//   const handleError = () => {
//     console.error('Google Login Failed');
//     handleError('Google login failed.');
//   };

//   return (
//     <div style={{ textAlign: 'center', margin: '20px' }}>
//       <GoogleLogin
//         onSuccess={handleSuccess}
//         onError={handleError}
//       />
//     </div>
//   );
// }

// export default GoogleAuth;

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode'; // Fixed import
import { useNavigate } from 'react-router-dom';
import { handleSuccess as showToastSuccess, handleError as showToastError } from '../utils';

function GoogleAuth() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    try {
      const details = jwtDecode(credentialResponse.credential);
      const userData = {
        token: credentialResponse.credential,
        picture: details.picture,
        name: details.name,
        email: details.email,
      };

      console.log('User Details:', userData);

      // Store in localStorage for persistence
      localStorage.setItem('token', userData.token);
      localStorage.setItem('loggedInUser', userData.name);
      localStorage.setItem('userEmail', userData.email);
      localStorage.setItem('userPicture', userData.picture);
      

      showToastSuccess('Login successful');
      navigate('/userdashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Error decoding token:', error);
      showToastError('Login failed. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    showToastError('Google login failed.');
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}

export default GoogleAuth;
