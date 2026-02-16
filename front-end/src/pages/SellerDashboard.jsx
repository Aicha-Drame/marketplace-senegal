// Dashboard vendeur - version avancée
export default function SellerDashboard({
  products,
  orders,
  updateOrderStatus,
  goAdd,
  onDelete,
  onEdit,
}) {

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0
  );

  return (
    <div className="page">

      <h2 className="seller-title">
        Tableau de bord vendeur
      </h2>

      {/* ================= STATS ================= */}
      <div className="seller-stats">
        <div className="seller-stat">
          <strong>{products.length}</strong>
          <div>Produits</div>
        </div>

        <div className="seller-stat">
          <strong>{totalStock}</strong>
          <div>Stock total</div>
        </div>

        <div className="seller-stat">
          <strong>{orders.length}</strong>
          <div>Commandes</div>
        </div>
      </div>

      <button
        className="primary add-product-btn"
        onClick={goAdd}
      >
        + Ajouter un produit
      </button>

      {/* ================= COMMANDES ================= */}
      <h3 style={{ marginTop: 30 }}>
        Commandes reçues
      </h3>

      {orders.length === 0 && (
        <p>Aucune commande pour le moment.</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="card"
          style={{ padding: 12, marginBottom: 12 }}
        >
          <strong>
            Commande #{order.id}
          </strong>

          <div>Date : {order.date}</div>
          <div>Total : {order.total} CFA</div>

          <div style={{ marginTop: 8 }}>
            Statut :
            <strong> {order.status}</strong>
          </div>

          {/* Boutons changement statut */}
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>

            {order.status === "En attente" && (
              <button
                className="secondary"
                onClick={() =>
                  updateOrderStatus(order.id, "Validée")
                }
              >
                Valider
              </button>
            )}

            {order.status === "Validée" && (
              <button
                className="primary"
                onClick={() =>
                  updateOrderStatus(order.id, "Livrée")
                }
              >
                Marquer livrée
              </button>
            )}

          </div>
        </div>
      ))}

      {/* ================= PRODUITS ================= */}
      <h3 style={{ marginTop: 30 }}>
        Mes produits
      </h3>

      {products.map((p) => (
        <div key={p.id} className="seller-product">

          {p.images?.[0] && (
            <img src={p.images[0]} alt={p.name} />
          )}

          <div className="seller-product-info">
            <strong>{p.name}</strong>
            <div>{p.price} CFA</div>
            <small>Stock : {p.stock}</small>
          </div>

          <div className="seller-actions">
            <button
              className="secondary"
              onClick={() => onEdit(p)}
            >
              Modifier
            </button>

            <button
              style={{ background: "#ef4444", color: "white" }}
              onClick={() => onDelete(p.id)}
            >
              Supprimer
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
