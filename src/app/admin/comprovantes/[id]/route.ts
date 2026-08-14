import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signedReceiptUrl } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const item = await prisma.contribution.findUnique({ where: { id } });
  if (!item) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const url = await signedReceiptUrl(item.receiptPath);
    return NextResponse.redirect(url);
  } catch {
    return new NextResponse("Arquivo não encontrado", { status: 404 });
  }
}
