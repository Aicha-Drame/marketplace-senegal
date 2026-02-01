// Composant carte produit (Home / Grille)
export default function ProductCard({ product, onAdd, onOpen }) {
  return (
    <div
      className="card"
      onClick={() => onOpen(product)}
      style={{ cursor: "pointer" }}
    >
      {/* Image principale */}
      {product.images?.[0] ? (
        <img
          src={product.images[0]}
          alt={product.name}
          style={{
            width: "100%",
            height: 160,
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            height: 160,
            background: "#f3f4f6",
          }}
        />
      )}

      {/* Infos produit */}
      <div style={{ padding: 12 }}>
        <h4 style={{ marginBottom: 4 }}>{product.name}</h4>

        <p style={{ fontWeight: "bold", fontSize: 16, marginBottom: 4 }}>
          {product.price} CFA
        </p>

        <small style={{ color: "#6b7280" }}>
          Stock : {product.stock}
        </small>

        {/* Bouton CTA */}
        <button
          className="primary"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          style={{ width: "100%", marginTop: 10 }}
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
