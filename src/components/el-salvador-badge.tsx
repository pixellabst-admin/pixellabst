/** Insignia decorativa de origen, pensada para la esquina de la portada. */
export function ElSalvadorBadge() {
  return (
    <div
      role="img"
      aria-label="Hecho en El Salvador"
      title="Hecho en El Salvador"
      style={{
        position: "absolute",
        top: "24px",
        right: "16px",
        display: "flex",
        alignItems: "center",
        gap: "9px",
        border: "1px solid rgba(255,255,255,0.28)",
        borderRadius: "999px",
        padding: "7px 12px 7px 7px",
        background: "rgba(15, 23, 42, 0.54)",
        color: "#ffffff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 2,
      }}
    >
      <svg
        width="34"
        height="23"
        viewBox="0 0 51 34"
        aria-hidden="true"
        style={{
          display: "block",
          overflow: "hidden",
          borderRadius: "3px",
          boxShadow: "0 1px 5px rgba(0,0,0,0.35)",
        }}
      >
        <rect width="51" height="11.34" fill="#0f5ea8" />
        <rect y="11.33" width="51" height="11.34" fill="#ffffff" />
        <rect y="22.66" width="51" height="11.34" fill="#0f5ea8" />
        <circle cx="25.5" cy="17" r="4.1" fill="#ffffff" stroke="#d4af37" strokeWidth="0.7" />
        <path d="M25.5 13.7l1.1 2.1 2.3.35-1.65 1.62.39 2.28-2.14-1.08-2.14 1.08.39-2.28-1.65-1.62 2.3-.35Z" fill="#0f5ea8" />
      </svg>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        Hecho en El Salvador
      </span>
    </div>
  );
}
