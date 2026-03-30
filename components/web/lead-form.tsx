"use client"

import { useState } from "react"
import { Button } from "~/components/common/button"
import { Input } from "~/components/common/input"
import { TextArea } from "~/components/common/textarea"
import { submitLead } from "~/server/web/leads/actions"

export function LeadForm({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError("")

    try {
      const formData = new FormData(e.currentTarget)
      await submitLead(formData)
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPending(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="font-semibold text-foreground">Quote Request Sent!</p>
        <p className="mt-1 text-sm text-secondary-foreground">
          {toolName} will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-foreground/10 p-4">
      <h3 className="font-semibold text-sm">Get a Quote from {toolName}</h3>

      <input type="hidden" name="toolId" value={toolId} />

      <Input name="name" placeholder="Your name" required size="lg" />
      <Input name="email" type="email" placeholder="Email address" required size="lg" />
      <Input name="phone" type="tel" placeholder="Phone (optional)" size="lg" />

      <div className="grid grid-cols-2 gap-3">
        <Input name="eventDate" type="date" placeholder="Event date" size="lg" />
        <Input
          name="eventType"
          placeholder="Event type"
          size="lg"
          list="event-types"
        />
        <datalist id="event-types">
          <option value="Corporate Event" />
          <option value="Wedding" />
          <option value="Birthday Party" />
          <option value="Fundraiser" />
          <option value="Private Party" />
          <option value="Other" />
        </datalist>
      </div>

      <Input name="zipCode" placeholder="Your zip code (optional)" size="lg" />
      <TextArea name="message" placeholder="Tell them about your event (optional)" rows={3} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" variant="fancy" size="lg" disabled={pending}>
        {pending ? "Sending..." : "Request Quote"}
      </Button>
    </form>
  )
}
