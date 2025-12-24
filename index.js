// index.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.json());

// ----------------------
// ROUTES PRODUITS
// ----------------------

// Lister tous les produits
app.get("/produits", async (req, res) => {
  try {
    const produits = await prisma.produit.findMany();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Créer un produit
app.post("/produits", async (req, res) => {
  try {
    const produit = await prisma.produit.create({ data: req.body });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// ROUTES UTILISATEURS
// ----------------------

// Lister tous les utilisateurs
app.get("/utilisateurs", async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany();
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer un utilisateur
app.post("/utilisateurs", async (req, res) => {
  try {
    const utilisateur = await prisma.utilisateur.create({ data: req.body });
    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// ROUTES COMMANDES
// ----------------------

// Lister toutes les commandes
app.get("/commandes", async (req, res) => {
  try {
    const commandes = await prisma.commande.findMany();
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une commande
app.post("/commandes", async (req, res) => {
  try {
    const commande = await prisma.commande.create({ data: req.body });
    res.json(commande);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Démarrage du serveur
// ----------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
