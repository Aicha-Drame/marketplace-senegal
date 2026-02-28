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
            aspectRatio: "1 / 1", // 🔥 clé Leboncoin
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            aspectRatio: "1 / 1",
            background: "#f3f4f6",
          }}
        />
      )}

      <div style={{ padding: 10 }}>
        <h4 style={{ fontSize: 14, marginBottom: 4 }}>
          {product.name}
        </h4>

        <p style={{ fontWeight: "bold", fontSize: 14 }}>
          {product.price} CFA
        </p>
         <button
          className="secondary"
          onClick={() => {
          setPage("chat");
         }}
>
         Contacter le vendeur
        </button>
        <button
          className="primary"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          style={{ width: "100%", marginTop: 8 }}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
