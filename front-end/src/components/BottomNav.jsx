// Barre de navigation en bas de l'écran
export default function BottomNav({ setPage }) {
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
      <button onClick={() => setPage("home")}>Accueil</button>
      <button onClick={() => setPage("cart")}>Panier</button>
    </div>
  );
}
