export function IconTrendUp({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 16l6-6 4 4 6-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 8h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconTrendDown({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8l6 6 4-4 6 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 16h6v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconWallet({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 6V5a2 2 0 012-2h6a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
      <path d="M17 13h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function IconPiggy({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 10c-2 0-3.5 1.5-4 3.5-.3 1.2-.5 2.5-.5 3.5 0 1.5 1 2.5 2.5 2.5h12c1.5 0 2.5-1 2.5-2.5 0-1-.2-2.3-.5-3.5C19.5 11.5 18 10 16 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M8 10V8a4 4 0 018 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}
