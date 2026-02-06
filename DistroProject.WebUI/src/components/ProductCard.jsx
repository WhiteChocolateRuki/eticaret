import React from 'react';
import { Button, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import '../pages/ProductList.css'; // Ensure styles are imported

const { Text } = Typography;

const ProductCard = ({ product }) => {
    // Helper to handle base64 images or URLs
    const getImageUrl = (img, contentType) => {
        if (!img) return 'https://via.placeholder.com/300?text=No+Image'; // Fallback
        if (img.startsWith('http')) return img;
        return `data:${contentType || 'image/png'};base64,${img}`;
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={getImageUrl(product.image, product.imageContentType)}
                    alt={product.name}
                    className="product-image"
                />
            </div>
            <div className="product-info">
                <div className="product-meta-row">
                    <div className="product-name" title={product.name}>
                        {product.name}
                    </div>
                    <div className="product-price">
                        ${product.price}
                    </div>
                </div>
                <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    className="add-to-cart-btn"
                    onClick={() => console.log('Add to cart:', product.id)} // Placeholder for now
                >
                    Sepete Ekle
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
