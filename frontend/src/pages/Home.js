import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css'; // 👈 Create this CSS file

function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:5000/api/products?search=${search}&category=${category}`);
    setProducts(res.data);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search items..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Books">Stationary</option>
          <option value="Instruments">Instruments</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      <h2 className="section-title">Available Items</h2>

      <div className="products-grid">
        {products.map(product => (
          <div className="product-card" key={product._id}>
            {product.image && <img src={product.image} alt={product.title} />}
            <h3>{product.title}</h3>
            <p className="description">{product.description}</p>
            <p><strong>₹{product.price}</strong> | {product.condition}</p>
            <p className="seller">Seller: {product.seller?.name || "Unknown"}</p>
           <p className="email">
  📧 <a href={`mailto:${product.seller?.email}`}>{product.seller?.email}</a>
</p>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
