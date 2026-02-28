// =============================
// CHAT (messages client ↔ vendeur)
// =============================
const [messages, setMessages] = useState(() => {
  const saved = localStorage.getItem("messages");
  return saved ? JSON.parse(saved) : [];
});

// sauvegarde automatique
useEffect(() => {
  localStorage.setItem("messages", JSON.stringify(messages));
}, [messages]);