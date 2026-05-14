interface WhimstackLogoProps {
  size?: number;
}

export default function WhimstackLogo({ size = 72 }: WhimstackLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Whimstack logo"
    >
      <circle cx="40" cy="40" r="40" fill="#1E3A5F"/>
      <path d="M12,16 L21,56" stroke="#60A5FA" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M21,56 L31,32" stroke="#A78BFA" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M31,32 L40,56" stroke="#60A5FA" strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="40" y1="56" x2="47" y2="42" stroke="#34D399" strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="43" y1="49" x2="55" y2="49" stroke="#34D399" strokeWidth="5" strokeLinecap="round" opacity="0.8"/>
      <line x1="47" y1="38" x2="58" y2="38" stroke="#34D399" strokeWidth="5" strokeLinecap="round" opacity="0.55"/>
      <line x1="51" y1="27" x2="61" y2="27" stroke="#34D399" strokeWidth="5" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}
