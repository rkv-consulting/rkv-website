import type { Metadata } from "next";
import { LegalShell } from "../components/LegalShell";

export const metadata: Metadata = { title: "Rentals and text messages | RKV Consulting" };

// The leasing line number is filled in once the Twilio number is bought.
const LEASING_LINE = "(number coming soon)";

export default function Rentals() {
  return (
    <LegalShell title="Rentals and text messages" updated="November 28, 2026">
      <p>RKV Consulting LLC manages rental homes in Bradford and Pottsville, Pennsylvania, and Tempe, Arizona. Renters and residents can call or text our leasing and repair line at {LEASING_LINE}. The line is answered by an automated AI assistant, and calls are recorded and transcribed. You can always ask for a person.</p>

      <h2>Available homes</h2>
      <p>15 Pearl Street, Bradford, PA: 3 bedrooms, 1 bath. Being renovated and expected to be available soon. Call or text the leasing line to ask questions or book a tour.</p>
      <p>Equal housing opportunity. Housing vouchers, including Section 8, are welcome. Assistance animals are not pets and are allowed.</p>

      <h2>Text message program</h2>
      <p><strong>Program:</strong> RKV Consulting rental line. We send text messages about rental inquiries you start, tour booking and reminders, application status, and repair requests you report.</p>
      <p><strong>How you opt in:</strong> by texting our leasing line first, or by telling us on a call that we may text you about your inquiry or repair. We never add you without your consent, and consent is not a condition of renting.</p>
      <p><strong>How often:</strong> message frequency varies with your inquiry or request.</p>
      <p><strong>Cost:</strong> Msg &amp; data rates may apply.</p>
      <p><strong>Stop or get help:</strong> reply STOP to stop messages at any time, and HELP for help. You can also email us at the address below.</p>
      <p><strong>Privacy:</strong> mobile numbers and text message consent are not shared with third parties or affiliates for marketing purposes. See our <a href="/privacy">privacy policy</a>.</p>
    </LegalShell>
  );
}
