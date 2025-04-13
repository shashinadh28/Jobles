'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Track page view
      window.gtag('config', 'G-ZDJPNTC8ZV', {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
        send_page_view: true
      });
      
      console.log('🔍 Page tracked in Google Analytics:', pathname);
    }
  }, [pathname, searchParams]);
};

// Add this type declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any> | string
    ) => void;
    dataLayer: any[];
  }
} 