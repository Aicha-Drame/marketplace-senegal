const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed...");

  // 1️⃣ Créer (ou récupérer) un vendeur via email (email est unique)
  const vendeur = await prisma.utilisateur.upsert({
    where: { email: "vendeur@test.com" },
    update: {
      nom: "Vendeur Test",
      role: "VENDEUR",
    },
    create: {
      nom: "Vendeur Test",
      email: "vendeur@test.com",
      motdepasse: "123456",
      role: "VENDEUR",
    },
  });

  // 2️⃣ Créer (ou récupérer) une boutique
  // Dans ton schema, vendeurId est unique -> parfait pour upsert
  const boutique = await prisma.boutique.upsert({
    where: { vendeurId: vendeur.id },
    update: {
      nom: "Boutique Bio Dakar",
      description: "Produits locaux et naturels",
    },
    create: {
      nom: "Boutique Bio Dakar",
      description: "Produits locaux et naturels",
      vendeurId: vendeur.id,
    },
  });

  // 3️⃣ Produits (safe sans upsert, car titre n'est pas unique)
  const produits = [
    {
      titre: "Miel pur",
      description: "Miel 100% naturel du Sénégal",
      prix: 4500,
      image: "https://via.placeholder.com/300",
      categorie: "Bio",
      stock: 10,
    },
    {
      titre: "Bissap séché",
      description: "Fleurs d’hibiscus naturelles",
      prix: 1500,
      image: "https://via.placeholder.com/300",
      categorie: "Local",
      stock: 25,
    },
    {
      titre: "Poudre de moringa",
      description: "Superaliment africain",
      prix: 3000,
      image: "https://via.placeholder.com/300",
      categorie: "Superaliment",
      stock: 15,
    },
  ];

  for (const produit of produits) {
    const exists = await prisma.produit.findFirst({
      where: {
        titre: produit.titre,
        boutiqueId: boutique.id,
      },
      select: { id: true },
    });

    if (!exists) {
      await prisma.produit.create({
        data: {
          ...produit,
          boutiqueId: boutique.id,
        },
      });
    }
  }

  // 4️⃣ Créer (ou récupérer) un acheteur (email unique)
  await prisma.utilisateur.upsert({
    where: { email: "awa@mail.com" },
    update: {
      nom: "Awa Ndiaye",
      role: "ACHETEUR",
    },
    create: {
      nom: "Awa Ndiaye",
      email: "awa@mail.com",
      motdepasse: "123456",
      role: "ACHETEUR",
    },
  });

  console.log("✅ Seed terminé avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
