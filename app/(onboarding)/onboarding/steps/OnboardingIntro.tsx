import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function OnboardingIntro() {
  return (
    <div
      style={{
        maxWidth: "26rem",
        width: "100%",
        textAlign: "center",
        minHeight: "34rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "2rem",
        borderRadius: "1rem",
        backgroundColor: "var(--color-surface)",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            background: "var(--color-success-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          🎉
        </div>

        <h2
          style={{
            fontSize: "var(--font-headline-large-size)",
            fontWeight: 500,
            color: "var(--color-on-surface)",
            margin: "0 0 0.75rem",
          }}
        >
          You&apos;re all set!
        </h2>
        <p
          style={{
            fontSize: "var(--font-body-large-reg-size)",
            color: "var(--color-on-surface-variant)",
            lineHeight: 1.6,
            marginBottom: "2rem",
            maxWidth: "28rem",
          }}
        >
          Start sending personalized whatsApp outreach messages now.
        </p>
      </div>

      <Link href="/dashboard" style={{ textDecoration: "none", width: "100%" }}>
        <Button
          id="onboarding-finish-btn"
          variant="primary"
          size="lg"
          fullWidth
        >
          Enter dashboard
        </Button>
      </Link>
    </div>
  );
}
