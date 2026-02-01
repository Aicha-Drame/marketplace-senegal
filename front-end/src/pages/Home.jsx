import { useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Home({ products, addToCart, openProduct }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  // Filtrage des produits
  const filtered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchName && matchCat;
  });

  return (
    <div style={{ padding: 16 }}>
      {/* Header */}
      <h2 style={{ marginBottom: 12 }}>SenShop</h2>

      {/* Recherche */}
      <input
        placeholder="Rechercher un produit..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      {/* Filtre catégorie */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: 16 }}
      >
        <option value="all">Toutes catégories</option>
        <option value="Alimentation">Alimentation</option>
        <option value="Boissons">Boissons</option>
      </select>

      {/* Grille produits */}
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

      {filtered.length === 0 && (
        <p style={{ marginTop: 20 }}>Aucun produit trouvé.</p>
      )}
    </div>
  );
}
