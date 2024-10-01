import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductDetail.css';

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

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (!product) {
        return <div className="error">Product not found</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-info">
                <div className="product-image">
                    <img src={product.images.url} alt={product.title} className="product-first-detail-image" />
                </div>
                <div className="product-details">
                    <h2 className="product-title">{product.title}</h2>
                    <p className="product-price">Price: ${product.price}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-category">Category: {product.category}</p>
                    <button className="add-to-cart-btn" onClick={() => console.log(`Added product with ID: ${product._id} to cart`)}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
