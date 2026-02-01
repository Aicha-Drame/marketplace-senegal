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
  const [page, setPage] = useState("home");
  const [currentProduct, setCurrentProduct] = useState(null);

  // Utilisateur (null = pas connecté)
  const [user, setUser] = useState(null);

  // Panier (chargé depuis localStorage)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Produits vendeur (chargés depuis localStorage)
  const [sellerProducts, setSellerProducts] = useState(() => {
    const saved = localStorage.getItem("sellerProducts");
    return saved ? JSON.parse(saved) : [];
  });

  // Sauvegarde automatique du panier
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Sauvegarde automatique des produits vendeur
  useEffect(() => {
    localStorage.setItem("sellerProducts", JSON.stringify(sellerProducts));
  }, [sellerProducts]);

  // Ajoute un produit au panier ou augmente sa quantité
  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);

      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Augmente la quantité
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: p.qty + 1 } : p
      )
    );
  };

  // Diminue la quantité (supprime si 0)
  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: p.qty - 1 } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  // Ouvrir un produit
  const openProduct = (product) => {
    setCurrentProduct(product);
    setPage("product");
  };

  // Ajouter un produit côté vendeur
  const addSellerProduct = (product) => {
    setSellerProducts((prev) => [...prev, product]);
  };

  // Tous les produits visibles côté acheteur
  const allProducts = [...baseProducts, ...sellerProducts];

  return (
    <>
      {/* Page de connexion */}
      {!user && <Login onLogin={setUser} />}

      {/* Pages acheteur */}
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
        />
      )}

      {/* Pages vendeur */}
      {user && user.role === "seller" && page === "seller" && (
        <SellerDashboard
          products={sellerProducts}
          goAdd={() => setPage("add-product")}
        />
      )}

      {user && user.role === "seller" && page === "add-product" && (
        <AddProduct
          onAdd={addSellerProduct}
          goBack={() => setPage("seller")}
        />
      )}

      {/* Navigation */}
      {user && <BottomNav setPage={setPage} user={user} setUser={setUser} />}
    </>
  );
}

export default App;
