import { Logo } from "./Logo";
import { CONTACT } from "../data";

export function LegalShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <header className="nav"><div className="wrap nav-in"><Logo /><a className="btn btn-ghost btn-sm" href="/">Back to site</a></div></header>
      <main className="legal">
        <span className="mono">Last updated {updated}</span>
        <h1 className="display">{title}</h1>
        <p className="note mono">Draft. This page will be reviewed before launch.</p>
        {children}
        <h2>Contact</h2>
        <p>{CONTACT.legalName} · {CONTACT.address} · <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> · <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></p>
      </main>
    </>
  );
}
