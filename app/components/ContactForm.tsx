"use client";
import { useState } from "react";
import { CONTACT } from "../data";

const SIZES = ["Just getting started", "1 to 50 doors", "50 to 250 doors", "250 to 1,000 doors", "1,000+ doors", "Lender or fund"];

/** Until a form backend is connected, the form opens the visitor's email app with everything filled in. */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const get = (k: string) => String(d.get(k) || "").trim();
    const body = [
      `Name: ${get("name")}`,
      `Company: ${get("company")}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      `Portfolio: ${get("size")}`,
      "",
      get("message"),
    ].join("\n");
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`RKV enquiry from ${get("name") || "the website"}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <form className="cform" onSubmit={onSubmit}>
      <div className="cf-row">
        <label><span>Name</span><input name="name" required autoComplete="name" /></label>
        <label><span>Company</span><input name="company" autoComplete="organization" /></label>
      </div>
      <div className="cf-row">
        <label><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
        <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" /></label>
      </div>
      <label><span>Portfolio size</span>
        <select name="size" defaultValue="">
          <option value="" disabled>Choose one</option>
          {SIZES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label><span>What should the agents take off your plate?</span><textarea name="message" rows={4} /></label>
      <button className="btn btn-primary" type="submit">Send message</button>
      <p className="mono cf-note" aria-live="polite">{sent ? "Your email app should open with the message ready to send." : "We reply within one business day."}</p>
    </form>
  );
}
