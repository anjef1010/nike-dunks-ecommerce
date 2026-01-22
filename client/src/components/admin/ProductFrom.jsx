// client/src/components/admin/ProductForm.jsx (adjust path if different)

import React, { useState, useEffect } from 'react';
// ... other imports like toast

const ProductForm = ({ product, onSubmit, onCancel }) => {
  // Initialize state based on whether we're editing or adding
  const [formData, setFormData] = useState({
    name: '', // Make sure this matches your Mongoose schema
    description: '',
    price: '',
    category: '',
    countInStock: '',
    image: null, // For the file input
    // ... any other product fields like brand, rating etc. if you have them
  });
  const [imagePreview, setImagePreview] = useState(product?.image || null); // To show current image on edit

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        countInStock: product.countInStock || '',
        image: null, // Don't pre-fill file input with existing image path
      });
      setImagePreview(product.image || null);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        countInStock: '',
        image: null,
      });
      setImagePreview(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file, // Store the file object itself
    }));
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Create a URL for preview
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new FormData instance
    const productData = new FormData();

    // Append all text fields
    productData.append('name', formData.name); // Make sure your Mongoose schema uses 'name'
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('category', formData.category);
    productData.append('countInStock', formData.countInStock);
    // ... append other text fields (brand, etc.)

    // Conditionally append the image file
    if (formData.image) {
      productData.append('image', formData.image);
    } else if (product && product.image) {
        // If editing and no new image is selected, but there was an old image,
        // you might want to send the old image path or handle it differently on backend.
        // For now, if no new file, and it's an edit, we assume the backend keeps the old one
        // if not explicitly overridden. Or you might need to append a hidden field.
        // A common pattern is to only send the 'image' field if a new file is chosen.
        // Or if your backend handles "no new image means keep old image", then you don't send anything.
        // If your backend *requires* an 'image' path even on update, you'd send `productData.append('image', product.image);`
        // But for *creation*, you must have req.file
    }


    onSubmit(productData); // Pass the FormData object to the parent handler
  };

  return (
    <div className="product-form-container"> {/* You can apply the red border here temporarily */}
      <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name" // Make sure this is 'name' to match Mongoose schema
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number" // Use type="number" for price and countInStock
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="countInStock">Count In Stock:</label>
          <input
            type="number" // Use type="number"
            id="countInStock"
            name="countInStock"
            value={formData.countInStock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input
            type="file" // Critical for file upload
            id="image"
            name="image" // Name must match Multer's single('image') argument
            onChange={handleImageChange}
            // required={!product} // Image required only on creation, not always on update
            // Or if you always want to force image re-upload on edit, keep it required.
          />
          {imagePreview && (
            <img 
                src={imagePreview.startsWith('/') ? `${import.meta.env.VITE_API_URL}${imagePreview}` : imagePreview} 
                alt="Product Preview" 
                style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px' }} 
            />
          )}
        </div>

        {/* Add fields for brand, rating, numReviews if needed, aligning with your Mongoose schema */}
        {/*
        <div className="form-group">
          <label htmlFor="brand">Brand:</label>
          <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
        </div>
        */}

        <div className="form-actions">
          <button type="submit" className="btn btn-success">
            {product ? 'Update Product' : 'Add Product'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;