import { useEffect, useState } from "react";

function Packages({ user }) {
  const [packages, setPackages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/packages", { credentials: "include" })
      .then((res) => res.json())
      .then(setPackages)
      .catch(console.error);
  }, []);

  const isCompany = user?.roles?.some((r) => r.authority === "TRAVEL_COMPANY");

  const handleAdd = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, description, price: Number(price) }),
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

    if (!updatedName || !updatedDescription || !updatedPrice) return;

    fetch(`http://localhost:8080/packages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: updatedName,
        description: updatedDescription,
        price: Number(updatedPrice),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update package");
        return res.json();
      })
      .then((updatedPackage) => {
        setPackages(
          packages.map((p) => (p.id === id ? { ...updatedPackage, companyName: p.companyName } : p))
        );
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div style={{ padding: "1rem", color: "white" }}>
      <h2>Travel Packages</h2>
      <ul>
        {packages.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> - {p.description} - ₹{p.price} (By {p.companyName})
            {isCompany && p.companyName === user.username && (
              <>
                <button onClick={() => handleUpdate(p.id)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {isCompany && (
        <form onSubmit={handleAdd}>
          <h3>Add New Package</h3>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" min="0" required />
          <button type="submit">Add Package</button>
        </form>
      )}
    </div>
  );
}

export default Packages;
