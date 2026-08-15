import { cache } from "react";
import { prisma } from "./prisma";

export const getSettings = cache(async () => {
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
        "Fique à vontade contribuir com o que couber no momento 💛. Os presentes podem ser divididos entre várias pessoas, então não precisa abraçar um item sozinho.",
    },
  });
});
