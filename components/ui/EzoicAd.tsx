'use client';

import React, { useEffect } from 'react';

interface EzoicAdProps {
  id: number;
  className?: string;
}

const EzoicAd: React.FC<EzoicAdProps> = ({ id, className = '' }) => {
  useEffect(() => {
    // Make sure this runs only in the browser
    if (typeof window !== 'undefined' && window.ezstandalone) {
      // Use the ezstandalone cmd queue to ensure the API is ready
      window.ezstandalone.cmd.push(function() {
        window.ezstandalone.showAds(id);
      });
    }

    // Cleanup function to destroy the ad when component unmounts
    return () => {
      if (typeof window !== 'undefined' && window.ezstandalone) {
        window.ezstandalone.cmd.push(function() {
          window.ezstandalone.destroyPlaceholders(id);
        });
      }
    };
  }, [id]);

  return (
    <div id={`ezoic-pub-ad-placeholder-${id}`} className={className}>
      {/* The ad will be injected here by Ezoic */}
    </div>
  );
};

// Add type declaration for the window object
declare global {
  interface Window {
    ezstandalone: {
      cmd: Array<() => void>;
      showAds: (...ids: number[]) => void;
      destroyPlaceholders: (...ids: number[]) => void;
      destroyAll: () => void;
    };
  }
}

export default EzoicAd; 