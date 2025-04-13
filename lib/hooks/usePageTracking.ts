'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const usePageTracking = () => {
  const pathname = usePathname();
  
  // We need to handle the case where useSearchParams is used outside a suspense boundary
  let searchParamsString = '';
  try {
    // This might throw an error if not used within a suspense boundary
    const searchParams = useSearchParams();
    searchParamsString = searchParams?.toString() ? `?${searchParams.toString()}` : '';
  } catch (e) {
    // If it fails, we'll just use the pathname without search params
    console.warn('Failed to access search params for analytics tracking');
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      // Track page view
      window.gtag('config', 'G-ZDJPNTC8ZV', {
        page_path: pathname + searchParamsString,
        send_page_view: true
      });
      
      console.log('🔍 Page tracked in Google Analytics:', pathname + searchParamsString);
    }
  }, [pathname, searchParamsString]);
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