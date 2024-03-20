import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function VerifyOTPPage() {
  const [otp, setOTP] = useState('');
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(0); // State to track the remaining time
  let history = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setEmail(searchParams.get('email')); // Extract email from URL parameters
  }, [location]);

  // Function to handle OTP verification
  const handleVerifyOTP = async () => {
    try {
       await axios.post('https://ecom-server-vbfv.onrender.com/api/verifyMail', { email, otp });
        // Handle successful OTP verification
        alert('OTP verified successfully!');
        // Redirect to the login page
        history('/login');
    
    } catch (error) {

      // Handle OTP verification error
      alert('OTP verification failed. Please try again.');
    }
  };

  // Function to handle resending OTP
  const handleResendOTP = async () => {
    try {
      setResendDisabled(true); // Disable resend button to prevent multiple clicks
      const response = await axios.post('https://ecom-server-vbfv.onrender.com/api/sendMail', { email });
      if (response.status === 200) {
        alert('OTP resent successfully!');
        // Set a timeout for 2 minutes (120000 milliseconds)
        setResendTimeout(120); // Set the initial timeout value to 120 seconds
        const interval = setInterval(() => {
          setResendTimeout(prevTimeout => prevTimeout - 1); // Decrement the remaining time
          if (resendTimeout <= 0) {
            clearInterval(interval); // Clear the interval when the timeout reaches 0
            setResendDisabled(false); // Re-enable the resend button
          }
        }, 1000); // Update the remaining time every second
      }
    } catch (error) {
      alert('Failed to resend OTP. Please try again.');
      setResendDisabled(false); // Re-enable resend button in case of error
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <p>Show email id: {email}</p>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
          style={{ width: '300px', height: '40px', fontSize: '16px', marginBottom: '20px' }}
        />
        <button
          onClick={handleVerifyOTP}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          Verify OTP
        </button>
        <button
          onClick={handleResendOTP}
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          disabled={resendDisabled} // Disable resend button if it's already clicked
        >
          Resend OTP {resendTimeout > 0 && `(${resendTimeout}s)`} {/* Display the remaining time */}
        </button>
      </div>
    </div>
  );
}

export default VerifyOTPPage;
