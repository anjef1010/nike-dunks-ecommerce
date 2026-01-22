// client/src/components/admin/ProductManagement.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import ProductForm from "../admin/ProductFrom"; // Corrected component name ProductFrom -> ProductForm
import '../../css/ProductManagement.css'; // Ensure this CSS file exists

const ProductManagement = () => {
  const { token, authAxios } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await authAxios.get("/api/products");
        
        // --- CRITICAL FIX: Ensure 'products' array is extracted from response data ---
        // Log the full response to debug if the structure is different
        console.log("ProductManagement: API Response Data:", data); 

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setError('Invalid products data received from API. Expected an array in `data.products`.');
          console.error("ProductManagement: API response for products was not an array:", data);
          setProducts([]); // Ensure products is an empty array to prevent map error
        }
        // --- END CRITICAL FIX ---

      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        toast.error(`Failed to load products: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if authAxios and token are available
    if (authAxios && token) {
      fetchProducts();
    }
  }, [authAxios, token]); // Re-run when authAxios or token changes

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await authAxios.delete(`/api/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Failed to delete product: ${errorMessage}`);
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null); // Clear any previous editing product
    setShowForm(true);       // Show the form
  };

  const handleFormSubmit = async (formData) => {
    try {
      const config = {
        headers: {
          // 'Content-Type': 'multipart/form-data' is typically set automatically by Axios
          // when you send a FormData object. No need to manually set it here.
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      
      if (editingProduct) {
        // If editing, use PUT request
        response = await authAxios.put(
          `/api/products/${editingProduct._id}`,
          formData,
          config
        );
      } else {
        // If adding new, use POST request
        response = await authAxios.post(
          "/api/products",
          formData,
          config
        );
      }

      // Backend should return the created/updated product directly or within a 'product' key
      const updatedOrCreatedProduct = response.data.product || response.data;
      
      if (editingProduct) {
        // Update the list of products by mapping over it
        setProducts(products.map(p => 
          p._id === updatedOrCreatedProduct._id ? updatedOrCreatedProduct : p
        ));
        toast.success("Product updated successfully");
      } else {
        // Add the new product to the list
        setProducts([...products, updatedOrCreatedProduct]);
        toast.success("Product added successfully");
      }
      
      // Hide the form and clear editing state after successful submission
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      // Improved error message extraction for form submission failures
      const errorMessage = err.response?.data?.message || 
                             err.response?.data?.error || 
                             err.message || 
                             'Operation failed';
      toast.error(errorMessage);
      console.error("Form submission error:", err.response?.data || err); // Log full error response for backend debugging
    }
  };

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <button 
          className="btn btn-primary"
          onClick={handleAddNew} // Calls handleAddNew to show the form
        >
          Add New Product
        </button>
      </div>

      {/* Render ProductForm conditionally when showForm is true */}
      {showForm && (
        <ProductForm
          product={editingProduct} // Pass the product if editing, null if adding new
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false); // Hide the form
            setEditingProduct(null); // Clear editing state
          }}
        />
      )}

      {/* Conditional rendering for loading, error, and product list */}
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : products.length === 0 ? (
        <p>No products available.</p> // Message when no products are fetched
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              {/* Hydration error fix: Ensure no whitespace between <th> tags */}
              <tr>
                <th>ID</th><th>Image</th><th>Title</th><th>Price</th><th>Category</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Ensure products is an array before mapping (already handled by useState init & fetch logic) */}
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id ? product._id.substring(0, 8) + '...' : 'N/A'}</td>
                  <td>
                    {product.image && (
                      <img 
                        // Prepend VITE_API_URL for relative image paths from server
                        src={product.image.startsWith('/') ? `${import.meta.env.VITE_API_URL}${product.image}` : product.image} 
                        alt={product.name || product.title || 'Product Image'} 
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>{product.name || product.title || 'N/A'}</td> {/* Use name or title based on your schema */}
                  <td>Rs. {product.price ? product.price.toFixed(2) : 'N/A'}</td>
                  <td>{product.category || 'N/A'}</td>
                  <td>{product.countInStock || 0}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;