import type { Metadata } from "next";
import { LegalShell } from "../components/LegalShell";

export const metadata: Metadata = { title: "Privacy policy | RKV Consulting" };

export default function Privacy() {
  return (
    <LegalShell title="Privacy policy" updated="November 28, 2026">
      <p>This policy explains what information RKV Consulting LLC (&ldquo;RKV&rdquo;, &ldquo;we&rdquo;) collects through this website and how we use it.</p>
      <h2>What we collect</h2>
      <p>When you contact us or book a call, we collect the details you give us, such as your name, company, email, phone number, portfolio size and your message. Like most websites, our hosting provider may also log basic technical data such as your browser type and pages visited.</p>
      <h2>How we use it</h2>
      <p>We use your information to reply to you, schedule calls, and send information you asked for. We do not sell your personal information.</p>
      <h2>Client data</h2>
      <p>Data our agents handle for clients is governed by each client&apos;s agreement with us. Agents get the narrowest access they need, and every action is logged.</p>
      <h2>Text messages and calls</h2>
      <p>If you call or text our rental line, an automated AI assistant answers, and calls are recorded and transcribed to handle your inquiry or repair request. We use your phone number and messages only to respond to you. No mobile information will be shared with third parties or affiliates for marketing or promotional purposes; text message opt-in data and consent are never shared with third parties. Reply STOP to opt out of texts and HELP for help. Program details are on our <a href="/rentals">rentals page</a>.</p>
      <h2>Sharing</h2>
      <p>We share information only with service providers that help us run our business (for example email, scheduling and hosting), or when the law requires it.</p>
      <h2>Your choices</h2>
      <p>You can ask us to see, correct or delete the personal information we hold about you by emailing us.</p>
    </LegalShell>
  );
}
