"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { checkPassword, clearAdminCookie, isAdmin, setAdminCookie } from "@/lib/auth";
import { parseReaisToCents } from "@/lib/money";
import { saveUpload } from "@/lib/uploads";

async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export async function loginAdmin(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const password = String(formData.get("password") || "");
  if (!checkPassword(password)) {
    return { error: "Senha incorreta." };
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/admin/login");
}

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  await prisma.settings.upsert({
    where: { id: "default" },
    update: {
      pixKey: String(formData.get("pixKey") || "").trim(),
      pixName: String(formData.get("pixName") || "").trim(),
      pixCity: String(formData.get("pixCity") || "").trim(),
      eventTitle: String(formData.get("eventTitle") || "").trim() || "Chá de casa",
      hostName: String(formData.get("hostName") || "").trim(),
      welcomeText: String(formData.get("welcomeText") || "").trim(),
    },
    create: {
      id: "default",
      pixKey: String(formData.get("pixKey") || "").trim(),
      pixName: String(formData.get("pixName") || "").trim(),
      pixCity: String(formData.get("pixCity") || "").trim(),
      eventTitle: String(formData.get("eventTitle") || "").trim() || "Chá de casa",
      hostName: String(formData.get("hostName") || "").trim(),
      welcomeText: String(formData.get("welcomeText") || "").trim(),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/config");
}

export async function saveProduct(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = parseReaisToCents(String(formData.get("price") || ""));
  const active = formData.get("active") === "on";
  const file = formData.get("image");

  if (name.length < 2) {
    return { error: "Informe o nome do produto." };
  }
  if (!price) {
    return { error: "Informe um preço válido." };
  }

  let imageUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await saveUpload(file, "product");
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Falha ao salvar a foto.",
      };
    }
  }

  if (id) {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        priceCents: price,
        allowPartial: true,
        active,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });
  } else {
    const last = await prisma.product.aggregate({ _max: { sortOrder: true } });
    await prisma.product.create({
      data: {
        name,
        description,
        priceCents: price,
        allowPartial: true,
        active,
        imageUrl: imageUrl || "",
        sortOrder: (last._max.sortOrder || 0) + 1,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function rejectContribution(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  await prisma.contribution.update({
    where: { id },
    data: { status: "rejected" },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/contribuicoes");
}

export async function confirmContribution(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  await prisma.contribution.update({
    where: { id },
    data: { status: "confirmed" },
  });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/contribuicoes");
}
