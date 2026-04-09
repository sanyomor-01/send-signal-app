import { NextRequest } from 'next/server'
import { getSession } from '@/lib/auth'
import { normalizePhoneNumber } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api'
import Papa from 'papaparse'

// POST /api/leads/import — server-side CSV parsing per csv-import.md
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorizedResponse()

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return errorResponse('No file provided', 400)

    const text = await file.text()

    // Parse CSV server-side with PapaParse
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, ''),
    })

    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      return errorResponse('Invalid CSV file', 422)
    }

    const results = {
      imported: 0,
      duplicates: 0,
      invalid: 0,
      invalidRows: [] as Array<{ row: number; phone: string; reason: string }>,
      leadIds: [] as string[],
    }

    // Attempt to auto-detect phone column
    const firstRow = parsed.data[0] ?? {}
    const phoneCol =
      ['phone', 'phonenumber', 'mobile', 'phone_number', 'contact', 'number']
        .find((k) => k in firstRow) ?? Object.keys(firstRow)[0]

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i]
      const rawPhone = row[phoneCol] ?? row['phone'] ?? ''
      const rowNum = i + 2 // 1-based, header is row 1

      if (!rawPhone.trim()) {
        results.invalid++
        results.invalidRows.push({ row: rowNum, phone: rawPhone, reason: 'Missing phone number' })
        continue
      }

      const phoneNumber = normalizePhoneNumber(rawPhone)
      if (!phoneNumber) {
        results.invalid++
        results.invalidRows.push({ row: rowNum, phone: rawPhone, reason: 'Invalid phone number format' })
        continue
      }

      const firstName = row['firstname'] ?? row['first_name'] ?? row['name'] ?? undefined
      const lastName = row['lastname'] ?? row['last_name'] ?? undefined
      const email = row['email'] ?? undefined
      const source = row['source'] ?? undefined
      const optIn = ['true', 'yes', '1'].includes((row['optin'] ?? row['opt_in'] ?? '').toLowerCase())

      try {
        const lead = await prisma.lead.upsert({
          where: { userId_phoneNumber: { userId: session.userId, phoneNumber } },
          update: {},
          create: {
            userId: session.userId,
            phoneNumber,
            firstName: firstName?.trim() || null,
            lastName: lastName?.trim() || null,
            email: email?.trim() || null,
            source: source?.trim() || null,
            optIn,
          },
        })

        // The upsert will not throw on duplicate — check if this is a new record
        const isNew = new Date(lead.createdAt).toISOString() === new Date(lead.updatedAt).toISOString()
        if (isNew) {
          results.imported++
          results.leadIds.push(lead.id)

          await prisma.activityLog.create({
            data: {
              userId: session.userId,
              leadId: lead.id,
              eventType: 'LEAD_IMPORTED',
              description: `Lead imported: ${phoneNumber}`,
            },
          })
        } else {
          results.duplicates++
        }
      } catch {
        results.invalid++
        results.invalidRows.push({ row: rowNum, phone: rawPhone, reason: 'Could not save lead' })
      }
    }

    return successResponse(results, `Import complete: ${results.imported} imported, ${results.duplicates} duplicates, ${results.invalid} invalid`)
  } catch (err) {
    return serverErrorResponse(err)
  }
}
