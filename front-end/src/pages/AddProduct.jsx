import { useState } from "react";

export default function AddProduct({ onAdd, goBack, product, onUpdate }) {

  const isEdit = !!product;

  // =============================
  // STATES
  // =============================
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [category, setCategory] = useState(
    product?.category || "Alimentation"
  );
  const [images, setImages] = useState(product?.images || []);

  // =============================
  // GESTION IMAGES (BASE64)
  // =============================
  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          resolve(reader.result);
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64Images) => {
      setImages(base64Images);
    });
  };

  // =============================
  // SUBMIT
  // =============================
  const submit = () => {
    if (!name || !price || !stock) return;

    const newProduct = {
      id: isEdit ? product.id : Date.now(),
      name,
      price: Number(price),
      stock: Number(stock),
      category,
      images,
    };

    if (isEdit) {
      onUpdate(newProduct);
    } else {
      onAdd(newProduct);
    }

    goBack();
  };

  // =============================
  // UI
  // =============================
  return (
    <div style={{ padding: 16 }}>

      {/* Retour */}
      <button onClick={goBack}>← Retour</button>

      <h2>{isEdit ? "Modifier produit" : "Ajouter produit"}</h2>

      {/* Nom */}
      <input
        placeholder="Nom produit"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      {/* Prix */}
      <input
        type="number"
        placeholder="Prix"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      {/* Stock */}
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      {/* Catégorie */}
     <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  style={{ marginBottom: 10 }}
>
  <option value="Alimentation">Alimentation</option>
  <option value="Boissons">Boissons</option>
</select>
 {/* IMAGE */}
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleImages}
/>

{/* PREVIEW */}
{images.length > 0 && (
  <div
    style={{
      display: "flex",
      gap: 8,
      overflowX: "auto",
      margin: "12px 0",
    }}
  >
    {images.map((img, i) => (
      <img
        key={i}
        src={img}
        alt="preview"
        style={{
          width: 120,
          height: 120,
          objectFit: "cover",
          borderRadius: 8,
        }}
      />
    ))}
  </div>
)}


      {/* Bouton */}
      <button
  onClick={submit}
  style={{
    marginTop: 12,
    padding: 10,
    width: "100%",
    borderRadius: 8,
    border: "none",
    background: "#ff6a00", // ✅ CORRECT
    color: "#fff", // ✅ CORRECT
  }}
>
  {isEdit ? "Enregistrer" : "Publier"}
</button>


    </div>
  );
}
