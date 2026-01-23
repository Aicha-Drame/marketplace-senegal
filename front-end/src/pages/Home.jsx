// On importe useState depuis React pour gérer des états (recherche, catégorie)
import { useState } from "react";

// On importe la liste des produits (données fictives)
import { products } from "../data/products";

// On importe le composant qui affiche une carte produit
import ProductCard from "../components/ProductCard";

// Composant principal de la page Accueil
export default function Home({ addToCart, openProduct }) {
  // État pour le texte de recherche
  const [query, setQuery] = useState("");

  // État pour la catégorie sélectionnée
  const [category, setCategory] = useState("all");

  // On filtre les produits selon la recherche et la catégorie
  const filtered = products.filter((p) => {
    // Vérifie si le nom du produit contient le texte recherché
    const matchName = p.name.toLowerCase().includes(query.toLowerCase());

    // Vérifie si la catégorie correspond
    const matchCat = category === "all" || p.category === category;

    // Le produit est gardé seulement si les deux conditions sont vraies
    return matchName && matchCat;
  });

  return (
    <div style={{ padding: 16 }}>
      <h2>SenShop</h2>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // met à jour la recherche
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      {/* Sélecteur de catégorie */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)} // change la catégorie
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 12,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      >
        <option value="all">Toutes les catégories</option>
        <option value="Alimentation">Alimentation</option>
        <option value="Boissons">Boissons</option>
      </select>

      {/* On affiche les produits filtrés */}
      {filtered.map((p) => (
        <ProductCard
          key={p.id}
          product={p}          // le produit à afficher
          onAdd={addToCart}    // fonction pour ajouter au panier
          onOpen={openProduct} // fonction pour ouvrir la page détail
        />
      ))}

      {/* Message si aucun produit ne correspond */}
      {filtered.length === 0 && <p>Aucun produit trouvé.</p>}
    </div>
  );
}
