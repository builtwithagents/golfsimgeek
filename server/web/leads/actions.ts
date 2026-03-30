"use server"

import { z } from "zod"
import { db } from "~/services/db"

const leadSchema = z.object({
  toolId: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  eventDate: z.string().optional(),
  eventType: z.string().optional(),
  zipCode: z.string().optional(),
  message: z.string().optional(),
})

export async function submitLead(formData: FormData) {
  const data = leadSchema.parse({
    toolId: formData.get("toolId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    eventDate: formData.get("eventDate") || undefined,
    eventType: formData.get("eventType") || undefined,
    zipCode: formData.get("zipCode") || undefined,
    message: formData.get("message") || undefined,
  })

  await db.lead.create({ data })

  return { success: true }
}
