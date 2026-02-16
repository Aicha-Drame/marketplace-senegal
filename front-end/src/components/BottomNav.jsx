import { FaHome, FaShoppingCart, FaUser } from "react-icons/fa";

export default function BottomNav({ setPage, user, setUser, cart = [] }) {
  return (
    <div className="bottom-nav">
      
      {/* MENU ACHETEUR */}
      {user.role === "buyer" && (
        <>
          <button onClick={() => setPage("home")}>
            <FaHome size={18} />
            Accueil
          </button>

          <button
            className="cart-btn"
            onClick={() => setPage("cart")}
          >
            <FaShoppingCart size={18} />
            Panier

            {/* Badge compteur */}
            {cart.length > 0 && (
              <span className="cart-badge">
                {cart.length}
              </span>
            )}
          </button>
        </>
      )}

      {/* MENU VENDEUR */}
      {user.role === "seller" && (
        <button onClick={() => setPage("seller")}>
          <FaUser size={18} />
          Dashboard
        </button>
      )}

      {/* Switch rôle (dev uniquement) */}
      <button
        onClick={() =>
          setUser((u) => ({
            ...u,
            role: u.role === "buyer" ? "seller" : "buyer",
          }))
        }
      >
        Mode
      </button>
    </div>
  );
}
