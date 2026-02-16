import { useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Home({ products, addToCart, openProduct }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  // 🔎 Filtrage des produits
  const filtered = products.filter((p) => {
    const matchName = p.name
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchCat =
      category === "all" || p.category === category;

    return matchName && matchCat;
  });

  return (
    <div className="page">

      {/* ================= HEADER ================= */}
      <h2>SenShop</h2>
<div className="hero">
  <h1 className="hero-title">
    Achetez local.
    <span>Soutenez les vendeurs sénégalais.</span>
  </h1>

  <p className="hero-subtitle">
    Découvrez les meilleurs produits alimentaires du Sénégal.
  </p>
</div>

      {/* ================= RECHERCHE ================= */}
      <input
        placeholder="Rechercher un produit..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* ================= FILTRE CATÉGORIES ================= */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">Toutes catégories</option>
        <option value="Les Essentiels">Les Essentiels</option>
        <option value="Fruits & Légumes">Fruits & Légumes</option>
        <option value="Viandes & Poissons">Viandes & Poissons</option>
        <option value="Boissons">Boissons</option>
        <option value="Produits locaux">Produits locaux</option>
      </select>

      {/* ================= GRILLE PRODUITS ================= */}
      <div className="products-grid">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onAdd={addToCart}
            onOpen={openProduct}
          />
        ))}
      </div>

      {/* ================= AUCUN RÉSULTAT ================= */}
      {filtered.length === 0 && (
        <p style={{ marginTop: 20 }}>
          Aucun produit trouvé.
        </p>
      )}
    </div>
  );
}
