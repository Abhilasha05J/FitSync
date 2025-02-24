// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { TextField, Button, Box } from "@mui/material";
// import SendIcon from '@mui/icons-material/Send';
// import DoneAllIcon from '@mui/icons-material/DoneAll';
// import FirstPageIcon from '@mui/icons-material/FirstPage';
// import ReplayIcon from '@mui/icons-material/Replay';
// import { ToastContainer } from "react-toastify";
// import { handleError, handleSuccess } from "../utils";

// function VerifyOtp() {
//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [isResend, setIsResend] = useState(false); 
//     const [timer, setTimer] = useState(0);

//       useEffect(() => {
//         let countdown;
//         if (timer > 0) {
//           countdown = setInterval(() => {
//             setTimer((prevTimer) => prevTimer - 1);
//           }, 1000);
//         }
//         return () => clearInterval(countdown);
//       }, [timer]);
    
// const navigate = useNavigate();
//   // Function to send OTP
//   const sendOtp = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone }),
//       });
//       const result = await response.json();
//       if (result.success) {
//         setOtpSent(true);
//         handleSuccess("OTP Sent Successfully");
//         console.log(result)
//       } else {
//         console.error(result.message);
//         handleError(result.message);
//       }
//     } catch (error) {
//       console.error(error);
//       handleError("Error sending OTP");
//     }
//   };

//   // Function to verify OTP
//   const verifyOtp = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/verify-otp", { 
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone, otp }),
//       });
//       const result = await response.json();
//       if (result.success) {
//         handleSuccess("OTP Verified Successfully");
//       } else {
//         console.error(result.message);
//         handleError(result.message);
//       }
//     } catch (error) {
//       console.error(error);
//       handleError("Error verifying OTP");
//     }
//   };

//   //FUnction to resend otp
//   const resendOtp = async () =>{
//     try{
//       const resonse = await fetch("https://localhost:8080/send-otp",{
//         method:"POST",
//         headers:{"Content-Type": "application/json"},
//         body: JSON.stringify({phone}),
//       });
//    const result = await resonse.json();
//    if(result.success){
//      handleSuccess("OTP sent successfully");
//      setTimer(30);
//      console.log(result)
//    }else {
//     console.log(result.message);
//     handleError(result.message);
//    }
//     }catch(error){
//       console.error(error);
//       handleError("Error sending OTP"); 
//     }
//   };


//   return (
//     <Box sx={{
//       backgroundColor: "#FFF",
//       padding: "32px 48px",
//       borderRadius: "10px",
//       width: "100%",
//       maxWidth: "400px",
//       boxShadow: "8px 8px 24px 0px rgba(66, 68, 90, 1)",
//     }}>
//     <FirstPageIcon onClick={() => navigate('/signup')} sx={{ mt: 2 }} color="secondary"/>
//     <h2>Verify Mobile Number</h2>
//     <br></br>
//     {!otpSent ? (
//       <>
//         <TextField
//           label="Mobile Number"
//           variant="outlined"
//           fullWidth
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//         />
//         <Button variant="contained" onClick={sendOtp} sx={{ mt: 2 , ml:3 }} endIcon={<SendIcon />} color="secondary">
//           Send OTP
//         </Button>    
//       </>
//     ) : (
//       <>
//         <TextField
//           label="Enter OTP"
//           variant="outlined"
//           fullWidth
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />
//         <Button variant="contained" onClick={verifyOtp} sx={{ mt: 2 }} color="secondary" endIcon={<DoneAllIcon/>}>
//           Enter OTP
//         </Button>
//         <Button
//             variant="contained"
//             onClick={resendOtp}
//             sx={{ mt: 2, ml: 2 }}
//             endIcon={<ReplayIcon />}
//             color="secondary"
//             disabled={timer > 0} // Disable button if timer is running
//           >
//             {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
//           </Button>
//       </>
//     )}
//     <ToastContainer/>
//   </Box>
//   );
// }

// export default VerifyOtp;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ReplayIcon from '@mui/icons-material/Replay';
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

function VerifyOtp() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isResend, setIsResend] = useState(false); // Track if resend button should appear
  const [timer, setTimer] = useState(0); // Timer state
  const navigate = useNavigate();

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // Function to send OTP
  const sendOtp = async () => {
    try {
      const response = await fetch("http://localhost:8080/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const result = await response.json();
      if (result.success) {
        setOtpSent(true);
        setIsResend(true); // Enable Resend option after OTP is sent
        setTimer(60); // Start a 60-second timer
        handleSuccess("OTP Sent Successfully");
        console.log(result);
      } else {
        console.error(result.message);
        handleError(result.message);
      }
    } catch (error) {
      console.error(error);
      handleError("Error sending OTP");
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:8080/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const result = await response.json();
      if (result.success) {
        handleSuccess("OTP Verified Successfully");
      } else {
        console.error(result.message);
        handleError(result.message);
      }
    } catch (error) {
      console.error(error);
      handleError("Error verifying OTP");
    }
  };

  // Function to resend OTP
  const resendOtp = async () => {
    try {
      const response = await fetch("http://localhost:8080/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const result = await response.json();
      if (result.success) {
        handleSuccess("OTP resent successfully");
        setTimer(60); // Restart a 60-second timer
        console.log(result);
      } else {
        console.log(result.message);
        handleError(result.message);
      }
    } catch (error) {
      console.error(error);
      handleError("Error resending OTP");
    }
  };

  return (
    <Box sx={{
      backgroundColor: "#FFF",
      padding: "32px 48px",
      borderRadius: "10px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "8px 8px 24px 0px rgba(66, 68, 90, 1)",
    }}>
      <FirstPageIcon onClick={() => navigate('/signup')} sx={{ mt: 2 }} color="secondary" />
      <h2>Verify Mobile Number</h2>
      <br />
      {!otpSent ? (
        <>
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button variant="contained" onClick={sendOtp} sx={{ mt: 2, ml: 10 }} endIcon={<SendIcon />} color="secondary">
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button variant="contained" onClick={verifyOtp} sx={{ mt: 2 }} color="secondary" endIcon={<DoneAllIcon />}>
            Enter OTP
          </Button>
          <Button
            variant="contained"
            onClick={resendOtp}
            sx={{ mt: 2, ml: 1 }}
            endIcon={<ReplayIcon />}
            color="secondary"
            disabled={timer > 0} // Disable button if timer is running
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
          </Button>
        </>
      )}
      <ToastContainer />
    </Box>
  );
}

export default VerifyOtp;
