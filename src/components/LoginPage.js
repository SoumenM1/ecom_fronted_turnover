import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ onLogin }) {
  let history = useNavigate(); // Access the history object
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      const response = await axios.post('https://ecom-server-y427.onrender.com/api/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // Redirect the user to the homepage or any other authenticated page
      onLogin();
      history('/');
    } catch (error) {
      if (error.response.created === true) {
        alert('User does not exist. Please register.');
        history('/register');
        return;
      }
      if (!error.response.emailVerified) {
        await axios.post('https://ecom-server-y427.onrender.com/api/sendMail', { email }); // Send email verification
        history(`/verifyotp?email=${email}`);
        return;
      }
      if (error.response && error.response.status === 401) {
        alert('Invalid email or password');
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
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: '10px', width: '300px', padding: '10px' }} />
        <div style={{ position: 'relative', width: '100%' }}>
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: '10px', width: 'calc(100% - 40px)', padding: '10px' }} />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>
        <button onClick={handleLogin} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', width: '300px' }}>Login</button>
        <button onClick={handleCreateAccount} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', width: '300px', marginTop: '10px' }}>Create Account</button>
      </div>
    </div>
  );
}

export default LoginPage;
