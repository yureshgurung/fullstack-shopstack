export default function ProductCard({ product, onEdit, onDelete, isOwner }) {
  return (
    <div className="product-card">
      <div className="product-img">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="product-img-placeholder">📦</div>
        )}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category || "General"}</span>
        <h3>{product.name}</h3>
        <p className="product-desc">{product.description || "No description."}</p>
        <div className="product-footer">
          <div>
            <span className="product-price">${product.price.toFixed(2)}</span>
            <span className="product-stock"> · {product.stock} in stock</span>
          </div>
          <span className="product-owner">by {product.owner?.username}</span>
        </div>
        {isOwner && (
          <div className="product-actions">
            <button className="btn btn-sm btn-outline" onClick={() => onEdit(product)}>
              ✏️ Edit
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(product.id)}>
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
