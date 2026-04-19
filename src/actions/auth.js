"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/db-config";

export async function registerUser(formData) {
  console.log("prismaaaa", prisma.user);
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
