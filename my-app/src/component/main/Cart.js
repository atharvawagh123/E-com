import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import  "../css/./Cart.css"
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true); // State to track loading status

    useEffect(() => {
        // Fetch the user's cart on component mount
        const fetchCart = async () => {
            try {
                const email = localStorage.getItem('userEmail'); // Get email from localStorage

                const response = await fetch('http://localhost:5000/user/cart', {
                    method: 'POST', // Use POST to send the email in the body
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }), // Send the email to the backend
                });

                const data = await response.json();
                console.log(data.cart); // Log the cart data

                if (response.ok) {
                    setCartItems(data.cart); // Store cart items in the state
                } else {
                    setError(data.msg); // Handle error message from the server
                }
            } catch (err) {
                setError('An error occurred while fetching the cart.'); // Catch and set error
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchCart(); // Call the fetchCart function
    }, []);

    const handleDelete = async (index) => {
        setLoading(true); // Set loading to true while deleting
        const email = localStorage.getItem('userEmail'); // Get email from localStorage
        const productId = cartItems[index]._id; // Get product ID

        try {
            const response = await fetch('http://localhost:5000/user/cart/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, productId }), // Send email and product ID to the backend
            });

            if (response.ok) {
                // Remove the item from the state
                setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
            } else {
                const data = await response.json();
                setError(data.msg); // Handle error message from the server
            }
        } catch (err) {
            setError('An error occurred while deleting the item.'); // Catch and set error
        } finally {
            setLoading(false); // Set loading to false after deleting
        }
    };

    return (
        <div className="cart-container">
            <h2 className="cart-heading">Your Cart</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {cartItems.length > 0 ? (
                <ul className="cart-list">
                    {cartItems.map((item, index) => (
                        <li key={item._id} className="cart-item">
                            <div className="cart-image">
                                <img src={item.images.url} alt={item.title} />
                            </div>
                            <div className="cart-info">
                                <h3 className="cart-item-title">{item.title}</h3>
                                <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                                <p className="cart-item-price">${item.price}</p>
                            </div>
                            <MdDelete
                                className="delete-btn"
                                onClick={() => handleDelete(index)}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>


    );
};

export default Cart;
