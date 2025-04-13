'use client';

import { usePageTracking } from '@/lib/hooks/usePageTracking';
import { Suspense } from 'react';

// Inner component that uses the hook wrapped in Suspense
function AnalyticsTracker() {
  usePageTracking();
  return null;
}

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
} 