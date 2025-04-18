'use client';
import React, { useEffect } from 'react';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

const GoogleAd: React.FC<GoogleAdProps> = ({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
}) => {
  useEffect(() => {
    try {
      // Check if window is defined (browser environment)
      if (typeof window !== 'undefined') {
        // Push the ad if adsbygoogle is available
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error loading Google AdSense ad:', error);
    }
  }, []);

  return (
    <div className={`google-ad-container ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6216500614121854"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default GoogleAd; 