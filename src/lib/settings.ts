import { prisma } from "./prisma";

export async function getSettings() {
  const existing = await prisma.settings.findUnique({
    where: { id: "default" },
  });
  if (existing) return existing;
  return prisma.settings.create({
    data: {
      id: "default",
      pixKey: "cole-sua-chave-pix-aqui",
      pixName: "",
      eventTitle: "Chá de casa",
      hostName: "",
      welcomeText:
        "Escolha um item da lista. Nos mais caros você pode contribuir só uma parte — o restante a gente junta com outras pessoas.",
    },
  });
}
