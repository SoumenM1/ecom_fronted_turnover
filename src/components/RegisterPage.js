import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/register', { name, email, password });
      // Handle successful registration
      // Assuming the API sends back a message after successful registration
      console.log(response)
      const message = response.data.msg;
      alert(message); // Display a success message

      // Send email verification and redirect to VerifyOTPPage
      await axios.post('http://localhost:4000/api/sendMail', { email }); // Send email verification
      history(`/verifyotp?email=${email}`); // Redirect to VerifyOTPPage
    } catch (error) {
      // Handle registration error
      if (error.response && error.response.data.error) {
        alert(error.response.data.error); // Display registration error message
      } else {
        alert('user is already exit plz login'); // Generic error message
      }
    }
  };

  const handleLogin = () => {
    // Redirect the user to the login page
    history('/login');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: '10px' }} />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '10px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: '10px' }} />
        <button onClick={handleRegister} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', marginRight: '10px' }}>Register</button>
        <button onClick={handleLogin} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>Login</button>
      </div>
    </div>
  );
}

export default RegisterPage;
