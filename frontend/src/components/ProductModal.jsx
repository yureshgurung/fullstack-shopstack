import { useState, useEffect } from "react";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "",
  image_url: "",
  stock: 0,
};

export default function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category: product.category || "",
        image_url: product.image_url || "",
        stock: product.stock,
      });
    } else {
      setForm(EMPTY);
    }
  }, [product]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{product ? "Edit Product" : "Add New Product"}</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="product-form">
          <label>Product Name *
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </label>
          <div className="form-row">
            <label>Price ($) *
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
            </label>
            <label>Stock
              <input name="stock" type="number" value={form.stock} onChange={handleChange} />
            </label>
          </div>
          <label>Category
            <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Electronics" />
          </label>
          <label>Image URL
            <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." />
          </label>
          <div className="modal-buttons">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving…" : product ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
