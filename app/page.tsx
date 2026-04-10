import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: 'var(--color-on-background)', backgroundColor: 'var(--color-background)' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(8px)',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.375rem', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="14" height="14" style={{ marginLeft: '2px' }}>
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, color: 'var(--color-on-surface)', fontSize: 'var(--font-title-medium-size)' }}>Send Signal</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginRight: '0.5rem' }}>
            {['Features', 'Use cases', 'Pricing', 'Contact'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} style={{ color: 'var(--color-on-surface)', textDecoration: 'none', fontSize: 'var(--font-body-medium-size)', fontWeight: 500 }}>{item}</Link>
            ))}
          </div>
          <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--color-outline-variant)' }}></div>
          <Link href="/sign-in" style={{ color: 'var(--color-on-surface-variant)', textDecoration: 'none', fontSize: 'var(--font-body-medium-size)' }}>Sign in</Link>
          <Link href="/sign-up" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', textDecoration: 'none', fontSize: 'var(--font-label-large-size)', fontWeight: 500 }}>
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '5rem 2rem 4rem', textAlign: 'center', maxWidth: '52rem', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.875rem', borderRadius: '999px', backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', fontSize: 'var(--font-label-medium-size)', fontWeight: 600, marginBottom: '1.5rem' }}>
          📡 WhatsApp outreach, done right
        </div>
        <h1 style={{ fontSize: 'var(--font-display-small-size)', fontWeight: 500, lineHeight: 1.15, color: 'var(--color-on-surface)', margin: '0 0 1.25rem', letterSpacing: '-0.03em' }}>
          Reach your leads where<br />they actually respond
        </h1>
        <p style={{ fontSize: 'var(--font-body-large-reg-size)', color: 'var(--color-on-surface-variant)', lineHeight: 1.7, margin: '0 0 2.5rem', maxWidth: '38rem', marginLeft: 'auto', marginRight: 'auto' }}>
          Send Signal lets you import leads, create personalized WhatsApp message templates, run campaigns at scale, and track every delivery, read, and reply — all from one place.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/sign-up" style={{ padding: '0.875rem 2rem', borderRadius: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', textDecoration: 'none', fontWeight: 600, fontSize: 'var(--font-body-large-size)' }}>
            Start for free →
          </Link>
          <Link href="/sign-in" style={{ padding: '0.875rem 2rem', borderRadius: '0.5rem', border: '1.5px solid var(--color-outline-variant)', color: 'var(--color-on-surface)', textDecoration: 'none', fontWeight: 500, fontSize: 'var(--font-body-large-size)' }}>
            Sign in
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid var(--color-outline-variant)', borderBottom: '1px solid var(--color-outline-variant)', padding: '2rem', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', maxWidth: '52rem', margin: '0 auto' }}>
          {[['98%', 'Message delivery rate'], ['90%+', 'Average read rate'], ['10×', 'Replies vs email'], ['< 5 min', 'Time to first campaign']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-headline-large-size)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', maxWidth: '68rem', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'var(--font-headline-large-size)', fontWeight: 500, color: 'var(--color-on-surface)', margin: '0 0 1rem' }}>Everything you need to run WhatsApp outreach</h2>
        <p style={{ textAlign: 'center', fontSize: 'var(--font-body-large-reg-size)', color: 'var(--color-on-surface-variant)', margin: '0 0 3rem', lineHeight: 1.6 }}>From lead import to campaign analytics — all in one platform.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: '1.25rem' }}>
          {[
            { icon: '📥', title: 'CSV Lead Import', desc: 'Import thousands of leads with flexible column mapping, E.164 phone validation, and duplicate detection.' },
            { icon: '📝', title: 'Message Templates', desc: 'Build reusable templates with dynamic placeholders like {firstName} and preview before sending.' },
            { icon: '📢', title: 'Campaign Automation', desc: 'Schedule campaigns, set batch sizes and message delays, and monitor progress in real time.' },
            { icon: '💬', title: 'Conversation Inbox', desc: 'Manage inbound replies alongside outbound messages in a clean chat-style interface.' },
            { icon: '📊', title: 'Delivery Analytics', desc: 'Track sent, delivered, read, replied, and converted rates across all your campaigns.' },
            { icon: '🛡️', title: 'Compliance Built-in', desc: 'Opt-in enforcement, automatic STOP/UNSUBSCRIBE keyword detection, and duplicate prevention.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--color-outline-variant)',
              backgroundColor: 'var(--color-surface)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.875rem' }}>{icon}</div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: 'var(--font-title-medium-size)', fontWeight: 600, color: 'var(--color-on-surface)' }}>{title}</h3>
              <p style={{ margin: 0, fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 2rem 5rem',
        padding: '4rem 2rem',
        borderRadius: '1.5rem',
        background: 'linear-gradient(135deg, #1a0800 0%, #331200 60%, #cc4700 100%)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 'var(--font-headline-large-size)', fontWeight: 500, color: '#ffffff', margin: '0 0 1rem' }}>
          Ready to start sending?
        </h2>
        <p style={{ fontSize: 'var(--font-body-large-reg-size)', color: 'rgba(255,255,255,0.8)', margin: '0 0 2rem', lineHeight: 1.6 }}>
          Get started free. No credit card required.
        </p>
        <Link href="/sign-up" style={{ display: 'inline-block', padding: '1rem 2.5rem', borderRadius: '0.5rem', backgroundColor: '#ffffff', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700, fontSize: 'var(--font-body-large-size)' }}>
          Create free account →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-outline-variant)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)' }}>© 2025 Send Signal. Built for real outreach.</span>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {['Features', 'Use cases', 'Pricing', 'Contact', 'Privacy', 'Terms'].map((l) => (
            <Link key={l} href={l === 'Privacy' || l === 'Terms' ? '#' : `#${l.toLowerCase().replace(' ', '-')}`} style={{ fontSize: 'var(--font-body-medium-size)', color: 'var(--color-on-surface-variant)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
