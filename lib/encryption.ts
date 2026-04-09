import * as crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(
  process.env.ENCRYPTION_KEY ?? 'send-signal-encryption-key-32char!', // 32 chars required
  'utf-8'
).slice(0, 32)

/**
 * Encrypts sensitive data (e.g. WhatsApp API tokens).
 * Used for access_token_encrypted in whatsapp_accounts.
 * Credentials must NEVER be exposed to the client (architecture.md §2).
 */
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':')
}

/**
 * Decrypts data encrypted with the encrypt() function.
 */
export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString('utf8')
}
