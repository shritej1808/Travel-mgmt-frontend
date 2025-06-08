import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import '../App.css';

function Packages({ user }) {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get("/packages");
        setPackages(response.data);
      } catch (err) {
        setError("Failed to fetch packages");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const isCompany = user?.roles?.some(r => r.authority === "TRAVEL_COMPANY");
  const isUser = user?.roles?.some(r => r.authority === "USER");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/packages", formData);
      setPackages([...packages, response.data]);
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: ""
      });
    } catch (err) {
      setError(err.response?.data || "Failed to add package");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/packages/${id}`);
      setPackages(packages.filter(pkg => pkg.id !== id));
    } catch (err) {
      setError(err.response?.data || "Failed to delete package");
    }
  };

  const handleUpdate = async (id) => {
    const packageToUpdate = packages.find(pkg => pkg.id === id);
    const updatedName = prompt("Name:", packageToUpdate.name);
    const updatedDescription = prompt("Description:", packageToUpdate.description);
    const updatedPrice = prompt("Price:", packageToUpdate.price);
    const updatedImageUrl = prompt("Image URL:", packageToUpdate.imageUrl);

    if (!updatedName || !updatedDescription || !updatedPrice || !updatedImageUrl) return;

    try {
      const response = await axios.put(`/packages/${id}`, {
        name: updatedName,
        description: updatedDescription,
        price: Number(updatedPrice),
        imageUrl: updatedImageUrl
      });
      setPackages(packages.map(pkg => 
        pkg.id === id ? response.data : pkg
      ));
    } catch (err) {
      setError(err.response?.data || "Failed to update package");
    }
  };

  const handleBook = (id) => {
    navigate(`/payment/${id}`);
  };

  if (loading) return <div>Loading packages...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="packages-container">
      <h2>Travel Packages</h2>
      
      <div className="packages-grid">
        {packages.map(pkg => (
          <div key={pkg.id} className="package-card">
            {pkg.imageUrl && (
              <img 
                src={pkg.imageUrl} 
                alt={pkg.name} 
                className="package-image"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <div className="package-details">
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <p className="price">${pkg.price.toFixed(2)}</p>
              <p className="company">By {pkg.companyName}</p>
              
              <div className="package-actions">
                {isCompany && pkg.companyName === user.username && (
                  <>
                    <button 
                      onClick={() => handleUpdate(pkg.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
                {isUser && (
                  <button 
                    onClick={() => handleBook(pkg.id)}
                    className="book-btn"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isCompany && (
        <form onSubmit={handleAddPackage} className="add-package-form">
          <h3>Add New Package</h3>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Package Name"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            min="0"
            step="0.01"
            required
          />
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="Image URL"
            required
          />
          <button type="submit">Add Package</button>
        </form>
      )}
    </div>
  );
}

export default Packages;