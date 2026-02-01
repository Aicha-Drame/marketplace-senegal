// Page du tableau de bord vendeur
export default function SellerDashboard({ products, goAdd }) {
  // Calcul du stock total de tous les produits
  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0
  );

  return (
    <div style={{ padding: 16 }}>
      <h2>Tableau de bord vendeur</h2>

      {/* Zone de statistiques rapides */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {/* Carte : nombre de produits */}
        <div style={cardStyle}>
          <strong>{products.length}</strong>
          <div>Produits</div>
        </div>

        {/* Carte : stock total */}
        <div style={cardStyle}>
          <strong>{totalStock}</strong>
          <div>Stock total</div>
        </div>

        {/* Carte : commandes (simulées pour l’instant) */}
        <div style={cardStyle}>
          <strong>0</strong>
          <div>Commandes</div>
        </div>
      </div>

      {/* Bouton pour aller à la page "Ajouter un produit" */}
      <button
        onClick={goAdd}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 16,
          borderRadius: 8,
        }}
      >
        + Ajouter un produit
      </button>

      <h3>Mes produits</h3>

      {/* Message si aucun produit */}
      {products.length === 0 && <p>Aucun produit pour le moment.</p>}

      {/* Liste des produits du vendeur */}
      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <strong>{p.name}</strong>
          <div>Prix : {p.price} CFA</div>
          <div>Stock : {p.stock}</div>
        </div>
      ))}
    </div>
  );
}

// Style commun pour les petites cartes de statistiques
const cardStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  background: "#f5f5f5",
  textAlign: "center",
};
