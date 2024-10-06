import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/Login.css'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log(data.user.name);
            localStorage.setItem('userName', data.user.name)

            if (response.ok) {
                // Save the email in localStorage
                localStorage.setItem('userEmail', email);
               

                // Handle successful login (e.g., store the access token)
                setSuccess('Login successful!');
                setError('');

                // Navigate to /product after successful login
                navigate('/');
            } else {
                // Handle error
                setError(data.msg);
                setSuccess('');
            }
        } catch (err) {
            setError('An error occurred while logging in.');
            setSuccess('');
        }
    };

    return (
        <div className="login-form-container">
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <p className="register-link">
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>

    );
};

export default Login;
