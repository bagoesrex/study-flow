"use server";

import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  loginSchema,
  type LoginInput,
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/auth-schema";
import { hashPassword } from "@/lib/password";
import type { ActionResponse } from "@/types/action-response";

export async function registerAction(
  input: RegisterInput
): Promise<ActionResponse<{ userId: string }>> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = parsed.data;

  const [existingUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    return {
      success: false,
      message: "Email sudah terdaftar.",
    };
  }

  const passwordHash = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      role: "USER",
    })
    .returning({
      id: users.id,
    });

  return {
    success: true,
    message: "Registrasi berhasil. Silakan login.",
    data: {
      userId: newUser.id,
    },
  };
}

export async function loginAction(input: LoginInput): Promise<ActionResponse> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login berhasil.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Email atau password salah.",
      };
    }

    return {
      success: false,
      message: "Terjadi kesalahan saat login.",
    };
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  });
}
