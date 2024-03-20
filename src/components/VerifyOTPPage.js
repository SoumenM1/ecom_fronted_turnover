import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function VerifyOTPPage() {
  const [otp, setOTP] = useState(['', '', '', '', '', '', '', '']); // Array to hold OTP digits
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
      const otpString = otp.join(''); // Convert array of OTP digits to string
      await axios.post('https://ecom-server-y427.onrender.com/api/verifyMail', { email, otp: otpString });
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
      const response = await axios.post('https://ecom-server-y427.onrender.com/api/sendMail', { email });
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

  // Function to handle input change for OTP digits
  const handleOTPChange = (index, value) => {
    const updatedOTP = [...otp];
    updatedOTP[index] = value;
    setOTP(updatedOTP);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <p>Show email id: {email}</p>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              style={{
                width: '40px',
                height: '40px',
                fontSize: '16px',
                textAlign: 'center',
                marginRight: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            />
          ))}
        </div>
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
            marginRight: '10px',
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
            fontSize: '16px',
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
