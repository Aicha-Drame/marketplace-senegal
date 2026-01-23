// On importe useState depuis React
import { useState } from "react";

// On importe nos pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import BottomNav from "./components/BottomNav";

function App() {
  // page = quelle page est affichée ("home", "cart", "product")
  const [page, setPage] = useState("home");

  // cart = liste des produits ajoutés au panier
  const [cart, setCart] = useState([]);

  // currentProduct = produit sélectionné pour la page détail
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fonction pour ajouter un produit au panier
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Fonction pour ouvrir la page détail d’un produit
  const openProduct = (product) => {
    setCurrentProduct(product);
    setPage("product");
  };

  return (
    <>
      {/* Si la page est "home", on affiche Home */}
      {page === "home" && (
        <Home addToCart={addToCart} openProduct={openProduct} />
      )}

      {/* Si la page est "product", on affiche la page détail */}
      {page === "product" && (
        <Product
          product={currentProduct}
          addToCart={addToCart}
          goBack={() => setPage("home")}
        />
      )}

      {/* Si la page est "cart", on affiche le panier */}
      {page === "cart" && <Cart cart={cart} />}

      {/* Barre de navigation en bas */}
      <BottomNav setPage={setPage} />
    </>
  );
}

export default App;
