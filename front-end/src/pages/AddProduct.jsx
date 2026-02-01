import { useState } from "react";

// Page pour ajouter un produit (vendeur)
export default function AddProduct({ onAdd, goBack }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Alimentation");

  // Images sélectionnées (aperçus)
  const [images, setImages] = useState([]);

  // Gestion du choix des images (max 3)
  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages(previews);
  };

  const submit = () => {
    if (!name || !price || !stock) return;

    onAdd({
      id: Date.now(),
      name,
      price: Number(price),
      stock: Number(stock),
      category,
      images, // tableau de 1 à 3 images
    });

    goBack();
  };

  return (
    <div style={{ padding: 16 }}>
      <button onClick={goBack}>← Retour</button>
      <h2>Ajouter un produit</h2>

      <input
        placeholder="Nom du produit"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <input
        placeholder="Prix"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <input
        placeholder="Stock"
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      >
        <option value="Alimentation">Alimentation</option>
        <option value="Boissons">Boissons</option>
      </select>

      {/* Sélection des images */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImages}
        style={{ marginBottom: 12 }}
      />

      {/* Aperçu défilable des images */}
      {images.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            marginBottom: 16,
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`preview-${i}`}
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={submit}
        style={{
          width: "100%",
          padding: 12,
          background: "#ff6a00",
          color: "white",
          border: "none",
          borderRadius: 8,
        }}
      >
        Publier
      </button>
    </div>
  );
}
