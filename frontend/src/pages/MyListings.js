import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './mylistings.css'; // Make sure to import the updated CSS

function MyListings() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/products/my-products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        alert("Failed to load your listings.");
      }
    };
    fetchMyProducts();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete listing.");
    }
  };

  return (
    <div className="listings-wrapper">
      <h2 className="listings-title">My Listings</h2>
      {products.length === 0 ? (
        <p className="no-listings-text">You have not listed any products yet.</p>
      ) : (
        <div className="listings-grid">
          {products.map(product => (
            <div key={product._id} className="listing-card">
              {product.image && (
                <img src={product.image} alt={product.title} className="listing-image" />
              )}
              <div className="listing-info">
                <h4 className="listing-title">{product.title}</h4>
                <p className="listing-price">₹ {product.price}</p>
                <p className="listing-meta">{product.category} | {product.condition}</p>
                <div className="listing-actions">
                  <button className="btn delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                  <button className="btn edit-btn" onClick={() => setEditProduct(product)}>Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
