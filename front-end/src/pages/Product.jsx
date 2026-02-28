// Composant carte produit
export default function ProductCard({ product, onAdd, onOpen }) {
  return (
    <div
      onClick={() => onOpen(product)}
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        marginBottom: 12,
        cursor: "pointer",
        overflow: "hidden", // empêche l’image de dépasser
        background: "#fff",
      }}
    >
      {/* Image produit */}
      {product.images?.[0] && (
        <img
          src={product.images[0]}
          alt={product.name}
          style={{
            width: "100%",
            height: 160,        // taille fixe
            objectFit: "cover", // image pro (pas étirée)
            display: "block",
          }}
        />
      )}

      {/* Informations produit */}
      <div style={{ padding: 12 }}>
        <h4 style={{ margin: "4px 0" }}>{product.name}</h4>

        <p style={{ margin: 0, fontWeight: "bold" }}>
          {product.price} CFA
        </p>

        <small>Stock : {product.stock}</small>

        {/* Bouton ajouter panier */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // empêche ouverture produit
            onAdd(product);
          }}
          style={{
            marginTop: 8,
            width: "100%",
            padding: 8,
            borderRadius: 8,
            border: "none",
            background: "#ff6a00",
            color: "#fff",
          }}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}