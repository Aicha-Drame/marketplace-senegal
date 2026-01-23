// Page qui affiche le détail d’un produit
export default function Product({ product, addToCart, goBack }) {
  // Si aucun produit n’est sélectionné, on n’affiche rien
  if (!product) return <p>Aucun produit sélectionné</p>;

  return (
    <div style={{ padding: 16 }}>
      {/* Bouton pour revenir à l’accueil */}
      <button onClick={goBack}>← Retour</button>

      {/* Infos du produit */}
      <h2>{product.name}</h2>
      <p>Prix : {product.price} CFA</p>
      <p>Stock : {product.stock}</p>

      {/* Ajouter au panier */}
      <button onClick={() => addToCart(product)}>
        Ajouter au panier
      </button>
    </div>
  );
}
