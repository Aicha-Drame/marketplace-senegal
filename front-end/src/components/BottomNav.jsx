import { FiHome, FiShoppingCart, FiList, FiUser } from "react-icons/fi";

// ===============================
// NAVIGATION BAS DE PAGE
// ===============================

export default function BottomNav({
setPage,
user,
setUser,
cart
}) {
return (
<div className="bottom-nav">

{/* ================= BUYER ================= */}
{user.role === "buyer" && (
<>
{/* Accueil */}
<button onClick={() => setPage("home")}>
<FiHome size={20} />
<span>Accueil</span>
</button>

{/* Panier avec badge */}
<button
onClick={() => setPage("cart")}
className="cart-btn"
>
<FiShoppingCart size={20} />
<span>Panier</span>

{/* Badge quantité */}
{cart && cart.length > 0 && (
<span className="cart-badge">
{cart.length}
</span>
)}
</button>

{/* Commandes */}
<button onClick={() => setPage("orders")}>
<FiList size={20} />
<span>Commandes</span>
</button>
</>
)}

{/* ================= SELLER ================= */}
{user.role === "seller" && (
<button onClick={() => setPage("seller")}>
<FiHome size={20} />
<span>Dashboard</span>
</button>
)}

{/* ================= SWITCH ROLE ================= */}
<button
onClick={() =>
setUser((u) => ({
...u,
role:
u.role === "buyer"
? "seller"
: "buyer",
}))
}
>
<FiUser size={20} />
<span>{user.role}</span>
</button>
</div>
);
}
