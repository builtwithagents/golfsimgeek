import { type CreateContactOptions, Resend } from "resend"
import { env } from "~/env"

let _resend: Resend | null = null

export const resend = new Proxy({} as Resend, {
  get(_, prop) {
    if (!_resend) {
      _resend = new Resend(env.RESEND_API_KEY ?? "")
    }
    return (_resend as any)[prop]
  },
})

export const createResendContact = async (payload: CreateContactOptions) => {
  const { error, data } = await resend.contacts.create(payload)

  if (error) {
    throw new Error("Failed to create resend contact. Please try again later.")
  }

  return data?.id
}
