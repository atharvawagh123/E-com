import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/Product.css'; // Ensure to import the CSS file
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify
import { IoIosAddCircle } from 'react-icons/io'; // Import the icon


function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // State to handle errors

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                if (data.status === 'success') {
                    setProducts(data.products);
                } else {
                    setError('Failed to fetch products.'); // Handle error case
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again.'); // Set error state
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (product_id) => { // Accept only the product ID
        const email = localStorage.getItem('userEmail'); // Get email from localStorage

        try {
            const response = await fetch('http://localhost:5000/user/addcart', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,        // Send the email
                    product_id,   // Send only the product ID
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`Added product with ID: ${product_id} to cart`); // Log success
                toast.success(data.message || 'Product added to cart!'); // Use toast for success
            } else {
                console.error(data.message || 'Failed to add product to cart.'); // Log failure
                toast.error(data.message || 'Failed to add product to cart.'); // Use toast for error
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('An error occurred while adding the product to the cart.'); // Use toast for fetch error
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="product-list">
            {error && <p className="error-message">{error}</p>} {/* Show error message */}
            <div className="card-container">
                {products.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={product.images.url} alt={product.title} className="card-image" />
                        <h3 className="card-title">{product.title}</h3>
                        <p className="card-price">Price: ${product.price}</p>
                        <p className="card-description">{product.description}</p>
                        <p className="card-category">Category: {product.category}</p>
                        <div className="card-button-container">
                            <IoIosAddCircle className="card-logo" onClick={() => handleAddToCart(product._id)} />
                            <Link to={`/Product/${product._id}`} className="card-more-info"> {/* Navigate to ProductDetail */}
                                More Info
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer /> {/* Add the ToastContainer to your component */}
        </div>

    );
}

export default Products;
