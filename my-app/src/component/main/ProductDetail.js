import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/ProductDetail.css';
import { IoIosAddCircle } from 'react-icons/io';
import { FaCartPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoSend } from 'react-icons/io5'; // Importing the send icon
import { IoPersonCircle } from 'react-icons/io5'; // Importing the account icon
import { MdDeleteForever } from "react-icons/md";

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const name = localStorage.getItem('userName'); // Correct variable name

    useEffect(() => {
        const fetchProductAndComments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();

                if (data.status === 'success') {
                    setProduct(data.product);
                    setComments(data.product.comments || []); // Ensure comments is an array
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndComments();
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
                console.log('Product added to cart');
                toast.success('Product added to cart!');
            } else {
                console.error('Failed to add product to cart');
                toast.error('Failed to add product to cart.');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Error adding product to cart.');
        }
    };
  
    const handleAddComment = async () => {
        if (!newComment) {
            toast.error('Comment cannot be empty.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: name,
                    comment: newComment,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.newComment) {
                    console.log('Comment added successfully');
                    setComments((prevComments) => [...prevComments, data.newComment]); // Append new comment to the state
                    setNewComment(''); // Clear the input field
                    toast.success('Comment added successfully!');
                } else {
                    console.error('Unexpected response structure:', data);
                    toast.error('Failed to retrieve new comment data.');
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to add comment:', errorData);
                toast.error('Failed to add comment.');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Error adding comment.');
        }
    };

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (!product) {
        return <div className="error">Product not found</div>;
    }

    const Deletecomment = async (commentId) => {
        console.log(commentId);
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Comment deleted successfully');
                setComments((prevComments) =>
                    prevComments.filter((comment) => comment._id !== commentId)
                ); // Remove the deleted comment from state
                toast.success('Comment deleted successfully!');
            } else {
                console.error('Failed to delete comment');
                toast.error('Failed to delete comment.');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Error deleting comment.');
        }
    };


    return (
        <>
            <div className="product-detail-container">
                <ToastContainer />
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
                            <IoIosAddCircle className="cart-logo" onClick={() => handleAddToCart(product._id)} />
                            <Link to="/cart" className="go-to-cart-button">
                                <FaCartPlus className="cart-icon" />
                                Go to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <h2 className="reviews-title">User Reviews</h2>
            <div className="product-comments-section">
                {comments.length > 0 ? (
                    <div className="comments-wrapper">
                        {comments.map((comment, index) => (
                            <div key={index} className="single-comment-item">
                                <IoPersonCircle className="user-avatar" /> {/* Account icon */}
                                <h3 className="comment-username">{comment.username}</h3>
                                <p className="comment-text">{comment.comment}</p>
                                {name === comment.username && (
                                    <MdDeleteForever  onClick={() => Deletecomment(comment._id)} className="delete-comment-icon" />
                                )}
                                </div>

                        ))} 
                    </div>
                ) : (
                    <p className="no-comments-message">No reviews yet.</p>
                )}
            </div>

            {/* Add Comment Section */}
            <h3 className="add-comment-title">Leave a Comment</h3>
            <div className="comment-input-section">
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="new-comment-input"
                />
                <IoSend  onClick={handleAddComment} className="submit-comment-button"/>
                  
                
            </div>

        </>
    );
}

export default ProductDetail;
