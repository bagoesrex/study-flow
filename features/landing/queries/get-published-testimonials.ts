import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { testimonials } from "@/db/schema";

export async function getPublishedTestimonials() {
  return db
    .select({
      id: testimonials.id,
      name: testimonials.name,
      role: testimonials.role,
      message: testimonials.message,
      rating: testimonials.rating,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(eq(testimonials.isPublished, true))
    .orderBy(desc(testimonials.createdAt))
    .limit(6);
}
