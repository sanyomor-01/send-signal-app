'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { EmptyState, EMPTY_STATES } from '@/components/ui/EmptyState'

interface Template {
  id: string
  name: string
  body: string
  version: number
  placeholderSchemaJson: { placeholders?: string[] } | null
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(json => setTemplates(json.data?.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: '72rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-headline-large-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 0.25rem' }}>Templates</h1>
          <p style={{ margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>
            {loading ? 'Loading...' : `${templates.length} active templates`}
          </p>
        </div>
        <Link href="/dashboard/templates/create" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
            backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
            fontSize: 'var(--font-label-large-size)', fontWeight: 500,
          }}>+ New template</button>
        </Link>
      </div>

      {!loading && templates.length === 0 ? (
        <div style={{ borderRadius: '0.75rem', border: '1px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface)' }}>
          <EmptyState {...EMPTY_STATES.templates} action={{ label: 'Create template', href: '/dashboard/templates/create' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))', gap: '1rem' }}>
          {templates.map((t) => {
            const placeholders = t.placeholderSchemaJson?.placeholders ?? []
            return (
              <Link key={t.id} href={`/dashboard/templates/${t.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--color-outline-variant)',
                  backgroundColor: 'var(--color-surface)',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-primary)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(255,91,4,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-outline-variant)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontSize: 'var(--font-title-medium-size)', fontWeight: 600, color: 'var(--color-on-surface)' }}>{t.name}</h3>
                    <span style={{ fontSize: 'var(--font-label-small-size)', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>v{t.version}</span>
                  </div>
                  <p style={{
                    margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)',
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    lineHeight: 1.5, flex: 1,
                  }}>
                    {t.body}
                  </p>
                  {placeholders.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {placeholders.map((p) => (
                        <span key={p} style={{
                          padding: '0.15rem 0.5rem', borderRadius: '0.25rem',
                          backgroundColor: 'var(--color-primary-container)',
                          color: 'var(--color-on-primary-container)',
                          fontSize: 'var(--font-label-small-size)', fontFamily: 'monospace',
                        }}>{`{${p}}`}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}