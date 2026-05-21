import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

export default function ProductsPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);  // product being edited
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const data = await apiFetch("/products");
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (form) => {
    await apiFetch("/products", { method: "POST", body: JSON.stringify(form) }, token);
    load();
  };

  const handleUpdate = async (form) => {
    await apiFetch(`/products/${editTarget.id}`, { method: "PUT", body: JSON.stringify(form) }, token);
    setEditTarget(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await apiFetch(`/products/${id}`, { method: "DELETE" }, token);
    load();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>All Products</h1>
          <p className="subtitle">{products.length} products available</p>
        </div>
        <div className="header-right">
          <input
            className="search-input"
            placeholder="🔍 Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {user && (
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              + Add Product
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="spinner">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
          {user && <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Be the first to add one!</button>}
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isOwner={user?.id === p.owner_id}
              onEdit={setEditTarget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showCreate && (
        <ProductModal onClose={() => setShowCreate(false)} onSave={handleCreate} />
      )}
      {editTarget && (
        <ProductModal product={editTarget} onClose={() => setEditTarget(null)} onSave={handleUpdate} />
      )}
    </div>
  );
}
