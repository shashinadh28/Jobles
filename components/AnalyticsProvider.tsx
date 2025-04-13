'use client';

import { usePageTracking } from '@/lib/hooks/usePageTracking';

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize page tracking
  usePageTracking();
  
  return <>{children}</>;
} 