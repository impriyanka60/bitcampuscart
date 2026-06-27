import React, { useState } from 'react';
import axios from 'axios';
import './PostItem.css'; // 👈 Add this CSS file

function PostItem() {
  //const [formData, setFormData] = useState({
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    image: '',
    // 👈 add this
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/products', form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Item posted successfully");
      setForm({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        image: ''
      });
    } catch (err) {
      alert("Failed to post item");
    }
  };
  const [generating, setGenerating] = useState(false);
  const handleGenerateAI = async () => {
    if (!form.title && !form.category) {
      alert("Please enter at least Title and Category");
      return;
    }

    setGenerating(true);

    try {
      const res = await axios.post('/api/ai/generate-listing', {
        title: form.title,
        category: form.category,
        condition: form.condition,
        price: form.price,
        description: form.description,
      });

      // Auto-fill the form with AI suggestions
      setForm(prev => ({
        ...prev,
        title: res.data.title || prev.title,
        description: res.data.description || prev.description,
        price: res.data.suggestedPrice || prev.price,
        // You can also show tags separately
      }));

      alert("✅ AI suggestions applied successfully!");
    } catch (err) {
      alert("Failed to generate AI suggestions");
      console.error(err);
    }

    setGenerating(false);
  };

  return (
    <div className="post-container">
      <form onSubmit={handleSubmit} className="post-form">
        <h2>Post an Item</h2>

        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        {/* AI Button - Place it prominently */}
      <button 
        type="button" 
        onClick={handleGenerateAI}
        disabled={generating}
        style={{ background: "#28a745", color: "white", padding: "10px 20px", margin: "10px 0" }}
      >
        {generating ? "Generating..." : "✨ Generate with AI"}
      </button>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />

        <input name="category" placeholder="Category (e.g. Books)" value={form.category} onChange={handleChange} />
        <input name="condition" placeholder="Condition (e.g. Used)" value={form.condition} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />

        <button type="submit">Post Item</button>
      </form>
    </div>
  );
}

export default PostItem;
