'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=G-ZDJPNTC8ZV`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZDJPNTC8ZV', {
              page_path: window.location.pathname,
              stream_id: '10521646785',
              stream_name: 'JoBless',
              stream_url: 'https://www.jobless.careers/',
              send_page_view: true,
              debug_mode: true
            });
          `,
        }}
      />
    </>
  );
} 