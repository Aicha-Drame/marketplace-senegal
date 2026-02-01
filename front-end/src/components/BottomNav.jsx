export default function BottomNav({ setPage, user, setUser }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        padding: 10,
        background: "#fff",
        borderTop: "1px solid #ddd",
      }}
    >
      {user.role === "buyer" && (
        <>
          <button onClick={() => setPage("home")}>Accueil</button>
          <button onClick={() => setPage("cart")}>Panier</button>
        </>
      )}

      {user.role === "seller" && (
        <>
          <button onClick={() => setPage("seller")}>Dashboard</button>
        </>
      )}

      {/* Bouton pour changer de rôle (simulation) */}
      <button
        onClick={() =>
          setUser((u) => ({
            ...u,
            role: u.role === "buyer" ? "seller" : "buyer",
          }))
        }
      >
        Mode : {user.role}
      </button>
    </div>
  );
}
