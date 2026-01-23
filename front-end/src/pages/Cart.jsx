// Page Panier : affiche les produits ajoutés
export default function Cart({ cart }) {
  // On calcule le total
  const total = cart.reduce((s, p) => s + p.price, 0);

  return (
    <div style={{ padding: 16 }}>
      <h2>Panier</h2>

      {/* Liste des produits du panier */}
      {cart.map((p, i) => (
        <p key={i}>
          {p.name} – {p.price} CFA
        </p>
      ))}

      {/* Total */}
      <h3>Total : {total} CFA</h3>

      {/* Bouton fictif de commande */}
      <button>Commander</button>
    </div>
  );
}
