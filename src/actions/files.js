"use server";

import prisma from "@/lib/db-config";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getUserFiles() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, error: "Not authenticated" };
    }

    const files = await prisma.file.findMany({
      where: { userId: session.user.id },
      orderBy: { uploadedAt: "desc" },
    });

    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteFile(fileId) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Make sure this file belongs to the logged in user
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return { success: false, error: "File not found" };
    }

    if (file.userId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Deleting file also deletes all its chunks because of onDelete: Cascade
    await prisma.file.delete({
      where: { id: fileId },
    });

    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
