import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductCard.css'; // Create this CSS file

/**
 * Component to display a single product in a card format.
 * Used on HomePage and CollectionPage.
 *
 * @param {object} props - The component props.
 * @param {object} props.product - The product object to display.
 */
function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="product-info">
        <h3>
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default ProductCard;