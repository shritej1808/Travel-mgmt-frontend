import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Packages({ user }) {
  const [packages, setPackages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/packages", { credentials: "include" })
      .then((res) => res.json())
      .then(setPackages)
      .catch(console.error);
  }, []);

  const isCompany = user?.roles?.some((r) => r.authority === "TRAVEL_COMPANY");
  const isUser = user?.roles?.some((r) => r.authority === "USER");

  const handleAdd = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, description, price: Number(price), imageUrl }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add package");
        return res.json();
      })
      .then((newPackage) => {
        const normalizedPackage = {
          ...newPackage,
          companyName: newPackage.companyName || user.username,
        };
        setPackages([...packages, normalizedPackage]);
        setName("");
        setDescription("");
        setPrice("");
        setImageUrl("");
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/packages/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete package");
        setPackages(packages.filter((p) => p.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  const handleUpdate = (id) => {
    const updatedName = prompt("New name");
    const updatedDescription = prompt("New description");
    const updatedPrice = prompt("New price");
    const updatedImageUrl = prompt("New image URL");

    if (!updatedName || !updatedDescription || !updatedPrice || !updatedImageUrl) return;

    fetch(`http://localhost:8080/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: updatedName,
        description: updatedDescription,
        price: Number(updatedPrice),
        imageUrl: updatedImageUrl,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update package");
        return res.json();
      })
      .then((updatedPackage) => {
        setPackages(
          packages.map((p) =>
            p.id === id ? { ...updatedPackage, companyName: p.companyName } : p
          )
        );
      })
      .catch((err) => alert(err.message));
  };

  const handleBook = (id) => {
    navigate(`/payment/${id}`);
  };

  return (
    <div className="container">
      <h2 className="text-center">Travel Packages</h2>
      <div className="packages-list">
        {packages.map((p) => (
          <div key={p.id} className="package-card">
            <img
              src={p.imageUrl}
              alt="Travel"
              className="package-image"
              onError={(e) => (e.target.style.display = "none")}
            />
            <div className="package-content">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p className="package-price">₹{p.price}</p>
              <p className="package-company">By {p.companyName}</p>

              <div className="package-actions">
                {isCompany && p.companyName === user.username && (
                  <>
                    <button onClick={() => handleUpdate(p.id)}>Edit</button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      style={{ backgroundColor: "#e74c3c" }}
                    >
                      Delete
                    </button>
                  </>
                )}

                {isUser && (
                  <button 
                    onClick={() => handleBook(p.id)}
                    style={{ backgroundColor: "#27ae60" }}
                  >
                    Book
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isCompany && (
        <form onSubmit={handleAdd}>
          <h3>Add New Package</h3>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Name" 
            required 
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            min="0"
            required
          />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
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