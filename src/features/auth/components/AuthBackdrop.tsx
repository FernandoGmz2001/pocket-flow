export function AuthBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-muted">
      <svg
        className="size-full scale-110 grayscale"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="auth-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity="0.18" />
            <stop offset="45%" stopColor="var(--muted)" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.28" />
          </linearGradient>
          <filter id="auth-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <rect width="1200" height="800" fill="url(#auth-sky)" />
        <g filter="url(#auth-soft)" fill="var(--foreground)">
          <ellipse cx="220" cy="210" rx="160" ry="50" opacity="0.12" />
          <ellipse cx="820" cy="160" rx="220" ry="60" opacity="0.1" />
          <path d="M0 430 C160 360 260 400 380 370 C520 332 620 410 760 350 C900 292 1020 360 1200 310 V800 H0 Z" opacity="0.16" />
          <path d="M0 500 C140 450 280 520 420 470 C580 410 700 530 860 460 C1000 404 1100 480 1200 440 V800 H0 Z" opacity="0.22" />
          <path d="M0 590 C180 540 320 640 500 580 C680 516 820 650 980 590 C1100 548 1160 620 1200 600 V800 H0 Z" opacity="0.3" />
        </g>
      </svg>
      <div className="absolute inset-0 bg-background/25 backdrop-blur-2xl" />
    </div>
  )
}
