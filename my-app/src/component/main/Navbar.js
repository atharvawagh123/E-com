import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate to handle redirects
import '../css/Navbar.css';
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai"; 
import { FiLogOut } from "react-icons/fi"; 

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Initialize navigate to redirect after logout

    useEffect(() => {
        // Check if the userEmail exists in localStorage
        const email = localStorage.getItem('userEmail');
        if (email) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []); // This runs once when the component mounts

    const handleLogout = () => {
        // Clear userEmail from localStorage and update the state
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false); // Update the state
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo-container">
                    <AiOutlineUser className="user-logo" /> {/* User icon */}
                    <h1 className="navbar-logo">MyStore</h1>
                </div>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">
                            <AiOutlineHome /> {/* Home icon */}
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/cart" className="navbar-link">
                            <AiOutlineShoppingCart /> {/* Cart icon */}
                        </Link>
                    </li>
                    <li className="navbar-item">
                        {isLoggedIn ? (
                            <button className="navbar-link logout-button" onClick={handleLogout}>
                                <FiLogOut /> {/* Logout icon */}
                            </button>
                        ) : (
                            <Link to="/login" className="navbar-link">
                                <AiOutlineUser /> {/* User icon */}
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
