interface MarqueeProps {
  items: Array<{ text: string; em?: boolean }>;
  variant?: "lime" | "neutral";
  reverse?: boolean;
}

function Row({ items }: { items: MarqueeProps["items"] }) {
  return (
    <span className="item">
      {items.map((it, idx) => (
        <span key={idx} style={{ display: "inline-flex", gap: 36, alignItems: "center" }}>
          {it.em ? <em>{it.text}</em> : <span>{it.text}</span>}
          <span className="chev">{idx % 2 === 0 ? "›" : "✦"}</span>
        </span>
      ))}
    </span>
  );
}

export function Marquee({ items, variant = "lime", reverse = false }: MarqueeProps) {
  const classes = ["marquee"];
  if (variant === "neutral") classes.push("neutral");
  if (reverse) classes.push("reverse");

  return (
    <div className={classes.join(" ")} aria-hidden="true">
      <div className="marquee-track">
        <Row items={items} />
        <Row items={items} />
      </div>
    </div>
  );
}
