interface ECLogoProps {
  size?: number;
  className?: string;
}

export function ChevronLogo({ size = 32, className = "" }: ECLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EC logo"
      role="img"
    >
      {/* Background — adapts to theme */}
      <rect width="30" height="30" rx="6" className="fill-text-primary" />

      {/* E (left spine + bars) */}
      <rect x="6" y="7" width="3" height="16" className="fill-background" />
      <rect x="6" y="7" width="10" height="3" className="fill-background" />
      <rect x="6" y="13.5" width="8" height="3" className="fill-background" />
      <rect x="6" y="20" width="10" height="3" className="fill-background" />

      {/* C (open block shape, right side) */}
      <rect x="16" y="7" width="3" height="3" className="fill-background" />
      <rect x="16" y="20" width="3" height="3" className="fill-background" />
      <rect x="16" y="7" width="7" height="3" className="fill-background" />
      <rect x="16" y="20" width="7" height="3" className="fill-background" />
      <rect x="20" y="7" width="3" height="16" className="fill-background" />
    </svg>
  );
}
