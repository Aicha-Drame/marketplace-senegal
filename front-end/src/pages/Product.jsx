import { useState } from "react";

// Page détail produit
export default function Product({
  product,
  addToCart,
  goBack,
  openChat,
}) {
  // Sécurité si aucun produit
  if (!product) {
    return (
      <div className="page">
        <p>Aucun produit sélectionné.</p>
        <button onClick={goBack}>Retour</button>
      </div>
    );
  }

  // Gestion image active (slider)
  const [index, setIndex] = useState(0);

  const images = product.images?.length
    ? product.images
    : ["https://via.placeholder.com/400x300?text=Produit"];

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="page">

      {/* 🔙 Retour */}
      <button onClick={goBack}>← Retour</button>

      {/* 🖼 IMAGE PRINCIPALE */}
      <div style={{ position: "relative", marginTop: 16 }}>
        <img
          src={images[index]}
          alt={product.name}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
            borderRadius: 12,
          }}
        />

        {/* Slider si plusieurs images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={navBtnLeft}
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              style={navBtnRight}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* 🟠 Miniatures */}
      {images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 10,
            overflowX: "auto",
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              onClick={() => setIndex(i)}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 8,
                border:
                  i === index
                    ? "2px solid #ff6a00"
                    : "1px solid #ddd",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* 📦 INFOS PRODUIT */}
      <h2 style={{ marginTop: 16 }}>
        {product.name}
      </h2>

      <p style={{ color: "#6b7280" }}>
        Catégorie : {product.category}
      </p>

      <p
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 6,
        }}
      >
        {product.price} CFA
      </p>

      <p style={{ marginTop: 4 }}>
        Stock : {product.stock}
      </p>

      {/* 🛒 BOUTON AJOUTER */}
      <button
        className="primary"
        onClick={() => addToCart(product)}
        style={{
          width: "100%",
          marginTop: 16,
        }}
      >
        Ajouter au panier
      </button>

      {/* 💬 BOUTON CHAT */}
      <button
        className="secondary"
        onClick={openChat}
        style={{
          width: "100%",
          marginTop: 10,
        }}
      >
        Contacter le vendeur
      </button>
    </div>
  );
}

/* =============================
   STYLES NAVIGATION IMAGES
============================= */

const navBtnLeft = {
  position: "absolute",
  top: "50%",
  left: 10,
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.4)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: 32,
  height: 32,
  cursor: "pointer",
};

