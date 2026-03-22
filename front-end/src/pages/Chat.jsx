import { useState } from "react";

export default function Chat({
  user,
  product,
  messages,
  setMessages,
  goBack
}) {
  const [text, setText] = useState("");

  // Messages liés au produit
  const productMessages = messages.filter(
    (m) => m.productId === product.id
  );

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      productId: product.id,
      from: user.role,
      to: user.role === "buyer" ? "seller" : "buyer",
      text,
      date: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");
  };

  return (
    <div className="page">
      <button onClick={goBack}>← Retour</button>
      <h2>Discussion</h2>

      <div className="chat-box">
        {productMessages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.from === user.role
                ? "chat-message me"
                : "chat-message"
            }
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message..."
        />
        <button onClick={sendMessage}>
          Envoyer
        </button>
      </div>
    </div>
  );
}