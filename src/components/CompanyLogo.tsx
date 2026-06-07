import { useState } from "react";

export function CompanyLogo({
  name,
  url,
  size = 48,
  className = "",
}: {
  name: string;
  url?: string | null;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name.slice(0, 2).toUpperCase();
  const showImg = url && !failed;
  return (
    <div
      className={`rounded-xl bg-white shadow-sm ring-1 ring-border overflow-hidden grid place-items-center ${className}`}
      style={{ width: size, height: size }}
    >
      {showImg ? (
        <img
          src={url!}
          alt={name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="object-contain"
          style={{ width: size, height: size, padding: Math.max(4, size * 0.1) }}
        />
      ) : (
        <span
          className="font-bold"
          style={{ color: "var(--color-primary)", fontSize: Math.max(11, size * 0.32) }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
