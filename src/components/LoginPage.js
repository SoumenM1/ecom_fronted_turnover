import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ onLogin }) {
  let history = useNavigate(); // Access the history object
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if(!email || !password){
        alert("enter email and password")
        return
      }

      const response = await axios.post('http://localhost:4000/api/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // Redirect the user to the homepage or any other authenticated page
      onLogin();
      history('/');
    } catch (error) {
      if(error.response.status === 401){
        alert('Dont have account')
        history('/register');
        return
      }
      if(!error.response.emailVerified){
        await axios.post('http://localhost:4000/api/sendMail', { email }); // Send email verification
        history(`/verifyotp?email=${email}`);
        return
      }
      if (error.response && error.response.status === 401) {
        alert('plz enter email and password');
      } else {
        alert('Error logging in:', error);
      }
    }
  };

  const handleCreateAccount = () => {
    // Redirect the user to the registration page
    history('/register');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '10px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: '10px' }} />
        <button onClick={handleLogin} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', marginRight: '10px' }}>Login</button>
        <button onClick={handleCreateAccount} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>Create Account</button>
      </div>
    </div>
  );
}

export default LoginPage;
