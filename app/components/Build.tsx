import { CursorIcon } from "./Logo";

/** A block of the page; the build engine draws its frame when it is built. */
export function BF({ className = "", children, as = "div", id }: { size?: string; className?: string; children: React.ReactNode; as?: "div" | "article" | "li"; id?: string }) {
  const Tag = as as "div";
  return <Tag className={`bf ${className}`} id={id}>{children}</Tag>;
}

export function NamedCursor({ name, color, style }: { name: string; color: string; style?: React.CSSProperties }) {
  return (
    <div className="acur" style={style} aria-hidden="true">
      <CursorIcon color={color} />
      <span style={{ background: color }}>{name}</span>
    </div>
  );
}
