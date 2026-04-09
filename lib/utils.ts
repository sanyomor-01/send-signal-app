import { parsePhoneNumber, isValidPhoneNumber, PhoneNumber } from 'libphonenumber-js'

/**
 * Normalizes a phone number to E.164 format.
 * Returns null if the number is invalid.
 * Per database_schema.md §22 — all numbers stored in E.164 format.
 */
export function normalizePhoneNumber(raw: string): string | null {
  try {
    const cleaned = raw.trim().replace(/\s+/g, '')
    // Try parsing with a default region fallback
    const phone: PhoneNumber = parsePhoneNumber(cleaned, 'NG') // default to Nigeria region
    if (phone && phone.isValid()) {
      return phone.format('E.164')
    }
    return null
  } catch {
    return null
  }
}

/**
 * Validates that a string is a valid E.164 phone number.
 */
export function isE164(phone: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(phone)
}

/**
 * Renders a message template body by replacing placeholders with lead data.
 * Supported placeholders: {firstName}, {lastName}, {fullName}, {source}
 * Template rendering is ALWAYS done server-side (architecture.md §2).
 */
export function renderTemplate(
  body: string,
  data: {
    firstName?: string | null
    lastName?: string | null
    source?: string | null
    [key: string]: string | null | undefined
  }
): string {
  return body
    .replace(/\{firstName\}/g, data.firstName ?? '')
    .replace(/\{lastName\}/g, data.lastName ?? '')
    .replace(/\{fullName\}/g, [data.firstName, data.lastName].filter(Boolean).join(' '))
    .replace(/\{source\}/g, data.source ?? '')
    .replace(/\{(\w+)\}/g, (match, key) => {
      const val = data[key]
      return val ?? match
    })
}

/**
 * Extracts placeholder names from a template body string.
 */
export function extractPlaceholders(body: string): string[] {
  const matches = body.matchAll(/\{(\w+)\}/g)
  return [...new Set([...matches].map((m) => m[1]))]
}

/**
 * Checks if an inbound message body contains an unsubscribe keyword.
 * Per agents.md §2 compliance principles.
 */
export function isUnsubscribeMessage(body: string): boolean {
  const UNSUBSCRIBE_KEYWORDS = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT']
  const normalized = body.trim().toUpperCase()
  return UNSUBSCRIBE_KEYWORDS.some(
    (kw) => normalized === kw || normalized.startsWith(kw + ' ')
  )
}
