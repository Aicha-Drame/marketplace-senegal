import { useState } from "react";

// Page Ajouter / Modifier produit
export default function AddProduct({
  onAdd,
  onUpdate,
  product,
  goBack,
}) {

  // Si product existe → mode modification
  const isEdit = !!product;

  // États initiaux (pré-remplis si modification)
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [stock, setStock] = useState(product?.stock || "");
  const [category, setCategory] = useState(
    product?.category || "Alimentation"
  );

  const [images, setImages] = useState(product?.images || []);

  // Gestion des images (sauvegarde en base64 pour éviter disparition)
const handleImages = (e) => {
  const files = Array.from(e.target.files).slice(0, 3);

  const readers = files.map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result); // image en base64
      };

      reader.readAsDataURL(file);
    });
  });

  Promise.all(readers).then((base64Images) => {
    setImages(base64Images);
  });
};
  Promise.all(readers).then((base64Images) => {
    setImages(base64Images);
  });
};n

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

  return (
    <div className="page">

      <button onClick={goBack}>← Retour</button>

      <h2>
        {isEdit ? "Modifier produit" : "Ajouter un produit"}
      </h2>

      <input
        placeholder="Nom du produit"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Prix"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Alimentation">Alimentation</option>
        <option value="Boissons">Boissons</option>
      </select>

      {/* Upload images */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImages}
      />

      {/* Preview images */}
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

      <button className="primary" onClick={submit}>
        {isEdit ? "Enregistrer" : "Publier"}
      </button>

    </div>
  );
}
