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
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        createdAt: true,
        boutique: {
          select: { id: true, nom: true, description: true, createdAt: true },
        },
      },
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
    const { page = "1", limit = "12" } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [total, boutiques] = await Promise.all([
      prisma.boutique.count(),
      prisma.boutique.findMany({
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          nom: true,
          description: true,
          createdAt: true,
          vendeur: {
            select: { id: true, nom: true },
          },
          _count: {
            select: { produits: true },
          },
        },
      }),
    ]);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: boutiques,
    });
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
    const {
      categorie,
      q,
      min,
      max,
      page = "1",
      limit = "12",
      sort = "recent",
    } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 12));
    const skip = (pageNum - 1) * limitNum;

    const where = {
      ...(categorie ? { categorie: String(categorie) } : {}),
      ...(q
        ? {
            OR: [
              { titre: { contains: String(q), mode: "insensitive" } },
              { description: { contains: String(q), mode: "insensitive" } },
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

    const orderBy =
      sort === "price_asc"
        ? { prix: "asc" }
        : sort === "price_desc"
          ? { prix: "desc" }
          : { createdAt: "desc" };

    const [total, produits] = await Promise.all([
      prisma.produit.count({ where }),
      prisma.produit.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        select: {
          id: true,
          titre: true,
          description: true,
          prix: true,
          image: true,
          categorie: true,
          stock: true,
          createdAt: true,
          boutique: {
            select: {
              id: true,
              nom: true,
            },
          },
        },
      }),
    ]);

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data: produits,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier un produit (prix / stock / titre / description / image / categorie)
app.patch("/produits/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID produit invalide." });

    const {
      titre,
      description,
      prix,
      image,
      categorie,
      stock,
      boutiqueId, // optionnel: généralement on ne change pas ça, mais laissé si besoin
    } = req.body;

    // Construire un objet "data" uniquement avec les champs fournis
    const data = {};

    if (titre !== undefined) data.titre = String(titre).trim();
    if (description !== undefined)
      data.description = String(description).trim();
    if (image !== undefined) data.image = String(image).trim();
    if (categorie !== undefined) data.categorie = String(categorie).trim();

    if (prix !== undefined) {
      const p = Number(prix);
      if (Number.isNaN(p) || p < 0) {
        return res.status(400).json({ error: "prix invalide." });
      }
      data.prix = p;
    }

    if (stock !== undefined) {
      const s = Number(stock);
      if (!Number.isInteger(s) || s < 0) {
        return res.status(400).json({ error: "stock invalide (entier >= 0)." });
      }
      data.stock = s;
    }

    if (boutiqueId !== undefined) {
      const b = Number(boutiqueId);
      if (!b) return res.status(400).json({ error: "boutiqueId invalide." });
      data.boutiqueId = b;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        error:
          "Aucun champ à modifier. Envoie au moins un champ (prix, stock, titre...).",
      });
    }

    const produit = await prisma.produit.update({
      where: { id },
      data,
      select: {
        id: true,
        titre: true,
        description: true,
        prix: true,
        image: true,
        categorie: true,
        stock: true,
        createdAt: true,
        boutique: { select: { id: true, nom: true } },
      },
    });

    res.json(produit);
  } catch (err) {
    // Prisma: record not found
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Produit introuvable." });
    }
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

// Créer une commande (items: [{ produitId, quantite }])
app.post("/commandes", async (req, res) => {
  try {
    const { utilisateurId, items } = req.body;

    if (!utilisateurId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "utilisateurId et items[] sont requis.",
      });
    }

    const userId = Number(utilisateurId);
    if (!userId) {
      return res.status(400).json({ error: "utilisateurId invalide." });
    }

    // Normaliser / valider items
    const cleanItems = items.map((i) => ({
      produitId: Number(i.produitId),
      quantite: Number(i.quantite),
    }));

    if (
      cleanItems.some((i) => !i.produitId || !i.quantite || i.quantite <= 0)
    ) {
      return res
        .status(400)
        .json({ error: "Chaque item doit avoir produitId et quantite > 0." });
    }

    // Charger produits
    const produitIds = cleanItems.map((i) => i.produitId);
    const produits = await prisma.produit.findMany({
      where: { id: { in: produitIds } },
      select: { id: true, titre: true, prix: true, stock: true },
    });

    if (produits.length !== cleanItems.length) {
      return res
        .status(400)
        .json({ error: "Un ou plusieurs produits sont invalides." });
    }

    // Calcul total + check stock
    let total = 0;

    const itemsData = cleanItems.map((i) => {
      const p = produits.find((x) => x.id === i.produitId);
      if (!p) throw new Error("Produit introuvable.");

      if (p.stock < i.quantite) {
        throw new Error(`Stock insuffisant pour ${p.titre}`);
      }

      total += p.prix * i.quantite;

      return {
        produitId: p.id,
        quantite: i.quantite,
        prixUnitaire: p.prix,
      };
    });

    // Transaction : créer commande + items + décrémenter stock
    const commande = await prisma.$transaction(async (tx) => {
      const created = await tx.commande.create({
        data: {
          utilisateurId: userId,
          total,
          status: "EN_ATTENTE",
          items: { create: itemsData },
        },
        include: {
          utilisateur: {
            select: { id: true, nom: true, email: true, role: true },
          },
          items: { include: { produit: true } },
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
