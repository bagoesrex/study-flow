"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  updateProfileSchema,
  type UpdateProfileInput,
} from "@/features/settings/schemas/settings-schema";
import type { ActionResponse } from "@/types/action-response";
import type { CurrentUserProfile } from "@/types/settings";

function normalizeImage(value?: string) {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return value.trim();
}

async function requireAuthUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function getCurrentUserAction(): Promise<ActionResponse<CurrentUserProfile>> {
  try {
    const sessionUser = await requireAuthUser();

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);

    if (!user) {
      return {
        success: false,
        message: "User tidak ditemukan.",
      };
    }

    return {
      success: true,
      message: "User berhasil diambil.",
      data: user,
    };
  } catch {
    return {
      success: false,
      message: "Gagal mengambil data user.",
    };
  }
}

export async function updateProfileAction(
  input: UpdateProfileInput
): Promise<ActionResponse<CurrentUserProfile>> {
  const parsed = updateProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Input tidak valid.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const sessionUser = await requireAuthUser();

    const [existingEmailUser] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(and(eq(users.email, parsed.data.email), ne(users.id, sessionUser.id)))
      .limit(1);

    if (existingEmailUser) {
      return {
        success: false,
        message: "Email sudah digunakan oleh user lain.",
      };
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        name: parsed.data.name.trim(),
        email: parsed.data.email,
        image: normalizeImage(parsed.data.image),
        updatedAt: new Date(),
      })
      .where(eq(users.id, sessionUser.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile berhasil diperbarui.",
      data: updatedUser,
    };
  } catch {
    return {
      success: false,
      message: "Gagal memperbarui profile.",
    };
  }
}
