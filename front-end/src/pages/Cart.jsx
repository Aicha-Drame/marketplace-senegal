// Page Panier
// Affiche les produits + quantités + total + bouton commander
export default function Cart({
  cart,
  increaseQty,
  decreaseQty,
  placeOrder, // 👈 AJOUT
}) {

  // Si le panier est vide
  if (cart.length === 0) {
    return (
      <p style={{ padding: 16 }}>
        Panier vide
      </p>
    );
  }

  // Calcul du total du panier
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="page">

      {/* Titre */}
      <h2>Mon panier</h2>

      {/* Liste des produits */}
      {cart.map((item) => (
        <div
          key={item.id}
          className="card"
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 12,
            padding: 12,
            alignItems: "center",
          }}
        >

          {/* Image produit */}
          {item.images?.[0] && (
            <img
              src={item.images[0]}
              alt={item.name}
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          )}

          {/* Infos produit */}
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 14 }}>
              {item.name}
            </h4>

            <p style={{ fontWeight: "bold" }}>
              {item.price} CFA
            </p>

            {/* Gestion quantité */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
              }}
            >
              <button onClick={() => decreaseQty(item.id)}>−</button>
              <span>{item.qty}</span>
              <button onClick={() => increaseQty(item.id)}>+</button>
            </div>
          </div>
        </div>
      ))}

      {/* TOTAL DU PANIER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        <span>Total</span>
        <span>{total} CFA</span>
      </div>

      {/* BOUTON COMMANDER */}
      <button
        className="primary"
        style={{
          width: "100%",
          marginTop: 16,
          padding: 14,
          fontSize: 16,
        }}
        onClick={placeOrder} // 👈 VRAIE FONCTION
      >
        Commander
      </button>
    </div>
  );
}
