import type { Metadata } from "next";
import { LegalShell } from "../components/LegalShell";

export const metadata: Metadata = { title: "Terms | RKV Consulting" };

export default function Terms() {
  return (
    <LegalShell title="Terms of use" updated="November 23, 2026">
      <p>These terms cover your use of this website, operated by RKV Consulting LLC (&ldquo;RKV&rdquo;). By using the site you agree to them.</p>
      <h2>The website</h2>
      <p>The content on this site describes our services and is for general information. Examples, figures and demos are illustrations, not promises of specific results.</p>
      <h2>Services</h2>
      <p>Any work we do for you is covered by a separate written agreement, which takes priority over these terms.</p>
      <h2>Not advice</h2>
      <p>Nothing on this site is legal, tax, investment or financial advice.</p>
      <h2>Intellectual property</h2>
      <p>The RKV name, logo, text and designs on this site belong to RKV. Please do not copy them without permission.</p>
      <h2>Liability</h2>
      <p>The site is provided as is. To the extent the law allows, RKV is not liable for losses arising from your use of the site.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. The date at the top shows the latest version.</p>
    </LegalShell>
  );
}
