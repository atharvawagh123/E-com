import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/ProductDetail.css';
import { IoIosAddCircle } from 'react-icons/io';
import { FaCartPlus } from 'react-icons/fa'; // Import FaCartPlus
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();
                if (data.status === 'success') {
                    setProduct(data.product);
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async (product_id) => {
        const email = localStorage.getItem('userEmail');

        try {
            const response = await fetch('http://localhost:5000/user/addcart', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    product_id,
                }),
            });

            if (response.ok) {
                // Handle successful addition to cart
                console.log('Product added to cart');
                toast.success('Product added to cart!'); // Show success notification
            } else {
                console.error('Failed to add product to cart');
                toast.error('Failed to add product to cart.'); // Show error notification
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Error adding product to cart.'); // Show error notification
        }
    };

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (!product) {
        return <div className="error">Product not found</div>;
    }

    return (
        <div className="product-detail-container">
            <ToastContainer /> {/* ToastContainer to render notifications */}
            <div className="product-info">
                <div className="product-image">
                    <img src={product.images.url} alt={product.title} className="product-first-detail-image" />
                </div>
                <div className="product-details">
                    <h2 className="product-title">{product.title}</h2>
                    <p className="product-price">Price: ${product.price}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-category">Category: {product.category}</p>
                    <div className="button-container">
                        <IoIosAddCircle className="cart-logo" onClick={() => handleAddToCart(product._id)} /> {/* Logo as an icon */}
                        <Link to="/cart" className="go-to-cart-button">
                            <FaCartPlus className="cart-icon" /> {/* Use FaCartPlus icon */}
                            Go to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
