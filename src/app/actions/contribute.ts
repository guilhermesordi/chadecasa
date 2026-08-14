"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { remainingCents } from "@/lib/money";
import { saveUpload } from "@/lib/uploads";

export async function submitContribution(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const productId = String(formData.get("productId") || "");
  const name = String(formData.get("name") || "").trim();
  const amountCents = Number(formData.get("amountCents"));
  const file = formData.get("receipt");

  if (name.length < 2) {
    return { error: "Informe seu nome." };
  }
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return { error: "Valor inválido." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Envie o comprovante do PIX." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { contributions: true },
  });

  if (!product || !product.active) {
    return { error: "Produto não encontrado." };
  }

  const remaining = remainingCents(product.priceCents, product.contributions);
  if (remaining <= 0) {
    return { error: "Esse item já foi completado." };
  }
  if (amountCents > remaining) {
    return { error: "Esse valor já não cabe. Atualize a página e escolha de novo." };
  }
  let receiptPath: string;
  try {
    receiptPath = await saveUpload(file, "receipt");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Falha ao salvar o comprovante.",
    };
  }

  await prisma.contribution.create({
    data: {
      productId,
      contributorName: name,
      amountCents,
      receiptPath,
      status: "confirmed",
    },
  });

  revalidatePath("/");
  revalidatePath(`/produtos/${productId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/contribuicoes");
  redirect("/obrigado");
}
