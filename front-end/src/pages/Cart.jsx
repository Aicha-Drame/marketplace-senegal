export default function Cart({ cart, increaseQty, decreaseQty }) {
  const total = cart.reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  );

  return (
    <div style={{ padding: 16 }}>
      <h2>Mon panier</h2>

      {cart.length === 0 && <p>Votre panier est vide.</p>}

      {cart.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <div>
            <strong>{p.name}</strong>
            <div>{p.price} CFA</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => decreaseQty(p.id)}>-</button>
            <span>{p.qty}</span>
            <button onClick={() => increaseQty(p.id)}>+</button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <hr />
          <h3>Total : {total} CFA</h3>

          <button
            style={{
              width: "100%",
              padding: 12,
              marginTop: 12,
              borderRadius: 8,
              background: "#16a34a",
              color: "white",
              border: "none",
            }}
            onClick={() => alert("Commande envoyée (simulation)")}
          >
            Passer commande
          </button>
        </>
      )}
    </div>
  );
}
