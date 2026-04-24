'use client';

// Age verification disabled - all content is now accessible
interface ContentProtectionProps {
  children: React.ReactNode;
  requiresAgeVerification?: boolean;
  allowMinors?: boolean;
  adultContentWarning?: boolean;
}

export default function ContentProtection({ 
  children
}: ContentProtectionProps) {
  // Content protection disabled - render children unconditionally
  return <>{children}</>;
}