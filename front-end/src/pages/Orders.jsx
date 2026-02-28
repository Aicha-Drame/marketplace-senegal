// ===============================
// PAGE : MES COMMANDES (ACHETEUR)
// ===============================

export default function Orders({ orders }) {

  // Si aucune commande
  if (!orders || orders.length === 0) {
    return (
      <div className="page">
        <h2>Mes commandes</h2>
        <p>Aucune commande pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Mes commandes</h2>

      {/* Liste commandes */}
      {orders.map((order) => (
        <div key={order.id} className="card order-card">

          {/* Numéro */}
          <h4>Commande #{order.id}</h4>

          {/* Date */}
          <p>Date : {order.date}</p>

          {/* Total */}
          <p>
            Total : <strong>{order.total} CFA</strong>
          </p>

          {/* Statut */}
          <p>
            Statut :
            <span
              className={`order-status ${
                order.status === "En attente"
                  ? "pending"
                  : order.status === "Validée"
                  ? "validated"
                  : "delivered"
              }`}
            >
              {order.status}
            </span>
          </p>

        </div>
      ))}
    </div>
  );
}