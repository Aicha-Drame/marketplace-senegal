const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

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
// body: { nom, email, motdepasse, role? }  role = "ACHETEUR" | "VENDEUR" | "ADMIN"
app.post("/utilisateurs", async (req, res) => {
  try {
    const { nom, email, motdepasse, role } = req.body;

    if (!nom || !email || !motdepasse) {
      return res
        .status(400)
        .json({ error: "nom, email, motdepasse sont requis." });
    }

    const utilisateur = await prisma.utilisateur.create({
      data: { nom, email, motdepasse, role: role || "ACHETEUR" },
    });

    res.status(201).json(utilisateur);
  } catch (err) {
    // email unique
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// BOUTIQUES (vendeurs)
// ----------------------

// Lister toutes les boutiques
app.get("/boutiques", async (req, res) => {
  try {
    const boutiques = await prisma.boutique.findMany({
      include: { vendeur: true, produits: true },
    });
    res.json(boutiques);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une boutique
// body: { nom, description?, vendeurId }
app.post("/boutiques", async (req, res) => {
  try {
    const { nom, description, vendeurId } = req.body;

    if (!nom || !vendeurId) {
      return res.status(400).json({ error: "nom et vendeurId sont requis." });
    }

    // Optionnel : vérifier que l'utilisateur est vendeur
    const vendeur = await prisma.utilisateur.findUnique({
      where: { id: Number(vendeurId) },
    });
    if (!vendeur)
      return res.status(404).json({ error: "Vendeur introuvable." });
    if (vendeur.role !== "VENDEUR" && vendeur.role !== "ADMIN") {
      return res
        .status(400)
        .json({ error: "Cet utilisateur n'a pas le rôle VENDEUR." });
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

// Lister tous les produits
// supports query: ?categorie=Bio&q=miel&min=1000&max=5000
app.get("/produits", async (req, res) => {
  try {
    const { categorie, q, min, max } = req.query;

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

    const produits = await prisma.produit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { boutique: { include: { vendeur: true } } },
    });

    res.json(produits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer un produit
// body: { titre, description, prix, image, categorie, stock?, boutiqueId }
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
          "titre, description, prix, image, categorie, boutiqueId sont requis.",
      });
    }

    const produit = await prisma.produit.create({
      data: {
        titre,
        description,
        prix: Number(prix),
        image,
        categorie,
        stock: stock == null ? 0 : Number(stock),
        boutiqueId: Number(boutiqueId),
      },
    });

    res.status(201).json(produit);
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

// Créer une commande (calcul du total côté serveur) ✅
// body:
// {
//   "utilisateurId": 1,
//   "items": [
//     { "produitId": 2, "quantite": 1 },
//     { "produitId": 5, "quantite": 3 }
//   ]
// }
app.post("/commandes", async (req, res) => {
  try {
    const { utilisateurId, items } = req.body;

    if (!utilisateurId || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "utilisateurId et items[] sont requis." });
    }

    // Vérifier utilisateur
    const user = await prisma.utilisateur.findUnique({
      where: { id: Number(utilisateurId) },
    });
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable." });

    // Charger produits
    const produitIds = items.map((i) => Number(i.produitId));
    const produits = await prisma.produit.findMany({
      where: { id: { in: produitIds } },
    });

    // Map produitId -> produit
    const map = new Map(produits.map((p) => [p.id, p]));

    // Construire items commande + total
    let total = 0;

    const itemsData = items.map((i) => {
      const produitId = Number(i.produitId);
      const quantite = Number(i.quantite);

      if (!produitId || !quantite || quantite <= 0) {
        throw new Error("Chaque item doit avoir produitId et quantite > 0.");
      }

      const produit = map.get(produitId);
      if (!produit) throw new Error(`Produit ${produitId} introuvable.`);

      // Option stock (simple)
      if (produit.stock < quantite) {
        throw new Error(`Stock insuffisant pour le produit ${produit.titre}.`);
      }

      total += produit.prix * quantite;

      return {
        produitId,
        quantite,
        prixUnitaire: produit.prix,
      };
    });

    // Transaction: créer commande + items + décrémenter stock
    const commande = await prisma.$transaction(async (tx) => {
      const created = await tx.commande.create({
        data: {
          utilisateurId: Number(utilisateurId),
          total,
          items: { create: itemsData },
        },
        include: { items: { include: { produit: true } }, utilisateur: true },
      });

      // décrémenter stock
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
// Démarrage + shutdown propre
// ----------------------
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
