// Composant qui affiche un produit
export default function ProductCard({ product, onAdd, onOpen }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        cursor: "pointer",
      }}
      // Quand on clique sur la carte, on ouvre la page produit
      onClick={() => onOpen(product)}
    >
      <h4>{product.name}</h4>
      <p>{product.price} CFA</p>
      <small>Stock : {product.stock}</small>
      <br />

      {/* Bouton pour ajouter au panier */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // empêche d’ouvrir la page produit
          onAdd(product);
        }}
      >
        Ajouter
      </button>
    </div>
  );
}
