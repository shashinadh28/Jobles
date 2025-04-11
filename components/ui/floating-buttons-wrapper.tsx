'use client';

import dynamic from 'next/dynamic';

const FloatingButtons = dynamic(() => import('./floating-buttons'), {
  ssr: false
});

export default function FloatingButtonsWrapper() {
  return <FloatingButtons />;
} 