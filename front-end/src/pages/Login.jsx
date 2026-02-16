export default function Login({ onLogin }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Bienvenue sur SenShop</h2>
      <p>Choisissez votre profil :</p>

      <button
        onClick={() => onLogin({ name: "Client", role: "buyer" })}
        style={{
          width: "100%",
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
        }}
      >
        Je suis Acheteur
      </button>

      <button
        onClick={() => onLogin({ name: "Vendeur", role: "seller" })}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
        }}
      >
        Je suis Vendeur
      </button>
    </div>
  );
}
