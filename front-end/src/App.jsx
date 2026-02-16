import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";

import { products as baseProducts } from "./data/products";

function App() {

  // =============================
  // NAVIGATION
  // =============================
  const [page, setPage] = useState("home");
  const [currentProduct, setCurrentProduct] = useState(null);

  // =============================
  // UTILISATEUR
  // =============================
  const [user, setUser] = useState(null);

  // =============================
  // PANIER
  // =============================
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =============================
  // PRODUITS VENDEUR
  // =============================
  const [sellerProducts, setSellerProducts] = useState(() => {
    const saved = localStorage.getItem("sellerProducts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "sellerProducts",
      JSON.stringify(sellerProducts)
    );
  }, [sellerProducts]);

  // =============================
  // COMMANDES
  // =============================
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // =============================
  // FONCTIONS PANIER
  // =============================

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);

      if (found) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: p.qty + 1 } : p
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: p.qty - 1 } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  // =============================
  // PASSER COMMANDE
  // =============================

  const placeOrder = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ),
      date: new Date().toLocaleString(),
      status: "En attente",
    };

    setOrders((prev) => [...prev, newOrder]);
    setCart([]);
    setPage("home");
  };

  // =============================
  // METTRE À JOUR STATUT COMMANDE
  // =============================

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  // =============================
  // PRODUITS VENDEUR
  // =============================

  const addSellerProduct = (product) => {
    setSellerProducts((prev) => [...prev, product]);
  };

  const deleteSellerProduct = (id) => {
    setSellerProducts((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };

  const updateSellerProduct = (updatedProduct) => {
    setSellerProducts((prev) =>
      prev.map((p) =>
        p.id === updatedProduct.id
          ? updatedProduct
          : p
      )
    );
  };

  // =============================
  // PRODUIT DETAIL
  // =============================

  const openProduct = (product) => {
    setCurrentProduct(product);
    setPage("product");
  };

  const allProducts = [...baseProducts, ...sellerProducts];

  // =============================
  // RENDER
  // =============================

  return (
    <>
      {/* LOGIN */}
      {!user && <Login onLogin={setUser} />}

      {/* ================= ACHETEUR ================= */}

      {user && user.role === "buyer" && page === "home" && (
        <Home
          products={allProducts}
          addToCart={addToCart}
          openProduct={openProduct}
        />
      )}

      {user && user.role === "buyer" && page === "product" && (
        <Product
          product={currentProduct}
          addToCart={addToCart}
          goBack={() => setPage("home")}
        />
      )}

      {user && user.role === "buyer" && page === "cart" && (
        <Cart
          cart={cart}
          increaseQty={increaseQty}
          decreaseQty={decreaseQty}
          placeOrder={placeOrder}
        />
      )}

      {/* ================= VENDEUR ================= */}

      {user && user.role === "seller" && page === "seller" && (
        <SellerDashboard
          products={sellerProducts}
          orders={orders}
          updateOrderStatus={updateOrderStatus}
          goAdd={() => setPage("add-product")}
          onDelete={deleteSellerProduct}
          onEdit={(product) => {
            setCurrentProduct(product);
            setPage("edit-product");
          }}
        />
      )}

      {user && user.role === "seller" && page === "add-product" && (
        <AddProduct
          onAdd={addSellerProduct}
          goBack={() => setPage("seller")}
        />
      )}

      {user && user.role === "seller" && page === "edit-product" && (
        <AddProduct
          product={currentProduct}
          onUpdate={updateSellerProduct}
          goBack={() => setPage("seller")}
        />
      )}

      {/* NAVIGATION */}
      {user && (
        <BottomNav
          setPage={setPage}
          user={user}
          setUser={setUser}
        />
      )}
    </>
  );
}

export default App;
