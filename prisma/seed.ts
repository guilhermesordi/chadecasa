import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Jogo de cama casal",
    description: "Lençol, fronhas e cobertor para a cama nova.",
    priceCents: 28900,
    allowPartial: true,
    sortOrder: 1,
  },
  {
    name: "Jogo de panelas",
    description: "Conjunto antiaderente para o dia a dia na cozinha.",
    priceCents: 45900,
    allowPartial: true,
    sortOrder: 2,
  },
  {
    name: "Air fryer",
    description: "Pra fazer comida rápida sem bagunça.",
    priceCents: 39900,
    allowPartial: true,
    sortOrder: 3,
  },
  {
    name: "Kit toalhas",
    description: "Toalhas de banho e rosto.",
    priceCents: 15900,
    allowPartial: true,
    sortOrder: 4,
  },
  {
    name: "Cafeteira",
    description: "Café da manhã na casa nova.",
    priceCents: 22900,
    allowPartial: true,
    sortOrder: 5,
  },
  {
    name: "Jogo de copos",
    description: "Conjunto simples para a mesa.",
    priceCents: 8900,
    allowPartial: true,
    sortOrder: 6,
  },
  {
    name: "Aspirador",
    description: "Um dos itens mais caros — pode contribuir só uma parte.",
    priceCents: 54900,
    allowPartial: true,
    sortOrder: 7,
  },
  {
    name: "Jogo de pratos",
    description: "Pratos rasos e fundos para o dia a dia.",
    priceCents: 17900,
    allowPartial: true,
    sortOrder: 8,
  },
];

async function main() {
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      pixKey: "cole-sua-chave-pix-aqui",
      pixName: "Seu nome",
      eventTitle: "Chá de casa",
      hostName: "",
      welcomeText:
        "Escolha um item da lista. Nos mais caros você pode contribuir só uma parte — o restante a gente junta com outras pessoas.",
    },
  });

  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({ data: products });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
