const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ----------------------
// HEALTH CHECK
// ----------------------
app.get("/", (req, res) => {
  res.json({ ok: true, service: "marketplace-backend" });
});

// ----------------------
// UTILISATEURS
// ----------------------

// Lister tous les utilisateurs
app.get("/utilisateurs", async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      include: { boutique: true },
    });
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer un utilisateur
app.post("/utilisateurs", async (req, res) => {
  try {
    const { nom, email, motdepasse, role } = req.body;

    if (!nom || !email || !motdepasse) {
      return res
        .status(400)
        .json({ error: "nom, email et motdepasse sont requis." });
    }

    const utilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        motdepasse,
        role: role || "ACHETEUR",
      },
    });

    res.status(201).json(utilisateur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// BOUTIQUES
// ----------------------

// Lister toutes les boutiques
app.get("/boutiques", async (req, res) => {
  try {
    const boutiques = await prisma.boutique.findMany({
      include: {
        vendeur: true,
        produits: true,
      },
    });
    res.json(boutiques);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une boutique
app.post("/boutiques", async (req, res) => {
  try {
    const { nom, description, vendeurId } = req.body;

    if (!nom || !vendeurId) {
      return res.status(400).json({ error: "nom et vendeurId sont requis." });
    }

    const vendeur = await prisma.utilisateur.findUnique({
      where: { id: Number(vendeurId) },
    });

    if (!vendeur) {
      return res.status(404).json({ error: "Vendeur introuvable." });
    }

    if (vendeur.role !== "VENDEUR" && vendeur.role !== "ADMIN") {
      return res
        .status(400)
        .json({ error: "L'utilisateur n'est pas vendeur." });
    }

    const boutique = await prisma.boutique.create({
      data: {
        nom,
        description: description || null,
        vendeurId: Number(vendeurId),
      },
    });

    res.status(201).json(boutique);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// PRODUITS
// ----------------------

// Lister tous les produits (avec filtres)
app.get("/produits", async (req, res) => {
  try {
    const { categorie, q, min, max } = req.query;

    const where = {
      ...(categorie ? { categorie } : {}),
      ...(q
        ? {
            OR: [
              { titre: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(min || max
        ? {
            prix: {
              ...(min ? { gte: Number(min) } : {}),
              ...(max ? { lte: Number(max) } : {}),
            },
          }
        : {}),
    };

    const produits = await prisma.produit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        boutique: true,
      },
    });

    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer un produit
app.post("/produits", async (req, res) => {
  try {
    const { titre, description, prix, image, categorie, stock, boutiqueId } =
      req.body;

    if (
      !titre ||
      !description ||
      prix == null ||
      !image ||
      !categorie ||
      !boutiqueId
    ) {
      return res.status(400).json({
        error:
          "titre, description, prix, image, categorie et boutiqueId sont requis.",
      });
    }

    const produit = await prisma.produit.create({
      data: {
        titre,
        description,
        prix: Number(prix),
        image,
        categorie,
        stock: stock ? Number(stock) : 0,
        boutiqueId: Number(boutiqueId),
      },
    });

    res.status(201).json(produit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// PRODUITS PAR BOUTIQUE (NOUVEAU)
// ----------------------

// Lister les produits d'une boutique
app.get("/boutiques/:id/produits", async (req, res) => {
  try {
    const boutiqueId = Number(req.params.id);

    if (!boutiqueId) {
      return res.status(400).json({ error: "ID boutique invalide." });
    }

    const boutique = await prisma.boutique.findUnique({
      where: { id: boutiqueId },
    });

    if (!boutique) {
      return res.status(404).json({ error: "Boutique introuvable." });
    }

    const produits = await prisma.produit.findMany({
      where: { boutiqueId },
      orderBy: { createdAt: "desc" },
    });

    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// COMMANDES
// ----------------------

// Lister toutes les commandes
app.get("/commandes", async (req, res) => {
  try {
    const commandes = await prisma.commande.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        utilisateur: true,
        items: { include: { produit: true } },
      },
    });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une commande
app.post("/commandes", async (req, res) => {
  try {
    const { utilisateurId, items } = req.body;

    if (!utilisateurId || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "utilisateurId et items sont requis." });
    }

    const produitsIds = items.map((i) => Number(i.produitId));
    const produits = await prisma.produit.findMany({
      where: { id: { in: produitsIds } },
    });

    let total = 0;

    const itemsData = items.map((i) => {
      const produit = produits.find((p) => p.id === Number(i.produitId));
      if (!produit) throw new Error("Produit introuvable.");

      if (produit.stock < i.quantite) {
        throw new Error(`Stock insuffisant pour ${produit.titre}`);
      }

      total += produit.prix * i.quantite;

      return {
        produitId: produit.id,
        quantite: i.quantite,
        prixUnitaire: produit.prix,
      };
    });

    const commande = await prisma.$transaction(async (tx) => {
      const created = await tx.commande.create({
        data: {
          utilisateurId: Number(utilisateurId),
          total,
          items: { create: itemsData },
        },
        include: {
          items: { include: { produit: true } },
          utilisateur: true,
        },
      });

      for (const i of itemsData) {
        await tx.produit.update({
          where: { id: i.produitId },
          data: { stock: { decrement: i.quantite } },
        });
      }

      return created;
    });

    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------
// SERVER
// ----------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Clean shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
