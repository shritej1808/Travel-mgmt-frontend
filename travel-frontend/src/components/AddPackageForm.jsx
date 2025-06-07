import React, { useState } from 'react';
import axios from '../api/axiosConfig'; // use your custom instance

function AddPackageForm({ refreshPackages }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/packages', formData);
      setMessage('Package added successfully!');
      setFormData({ name: '', description: '', price: 0 });
      if (refreshPackages) refreshPackages();
    } catch (error) {
      setMessage(error.response?.data || 'Error adding package');
    }
  };

  return (
    <div>
      <h2>Add Travel Package</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Package name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="Package description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
        />
        <br />
        <button type="submit">Add Package</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddPackageForm;
