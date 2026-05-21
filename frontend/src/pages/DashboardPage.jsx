import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    const all = await apiFetch("/products");
    setProducts(all.filter((p) => p.owner_id === user.id));
    setLoading(false);
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

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.username} 👋</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          + New Product
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-num">{products.length}</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{products.reduce((s, p) => s + p.stock, 0)}</span>
          <span className="stat-label">Total Stock</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">${totalValue.toFixed(2)}</span>
          <span className="stat-label">Inventory Value</span>
        </div>
      </div>

      <h2 style={{ marginTop: "2rem" }}>Your Products</h2>

      {loading ? (
        <div className="spinner">Loading…</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>You haven't added any products yet.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Add your first product</button>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isOwner={true}
              onEdit={setEditTarget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showCreate && <ProductModal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
      {editTarget && <ProductModal product={editTarget} onClose={() => setEditTarget(null)} onSave={handleUpdate} />}
    </div>
  );
}
