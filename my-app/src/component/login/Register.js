import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../css/Register.css'

const Register = () => {
  const [name, setName] = useState(''); // State for name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }), // Include name in the request
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful registration
        setSuccess('Registration successful! Redirecting...');
        localStorage.setItem('userEmail', email);
        setError('');

        // Navigate to /product after a short delay
        setTimeout(() => {
          navigate('/product'); // Redirect to /product
        }, 1000); // You can adjust the delay if needed
      } else {
        // Handle error
        setError(data.msg);
        setSuccess('');
      }
    } catch (err) {
      setError('An error occurred while registering.');
      setSuccess('');
    }
  };

  return (
    <div className="register-form-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password:</label>
          <input
            type="password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>

  );
};

export default Register;
