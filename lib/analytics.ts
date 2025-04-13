/**
 * Helper functions for Google Analytics event tracking
 */

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log(`🔍 Event tracked: ${eventName}`, eventParams);
  }
};

// Track user interactions with specific elements
export const trackInteraction = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  trackEvent('interaction', {
    event_category: category,
    event_action: action,
    event_label: label,
    value: value,
  });
};

// Example usage:
// Job application tracking
export const trackJobApplication = (jobId: string, jobTitle: string, company: string) => {
  trackEvent('job_application', {
    job_id: jobId,
    job_title: jobTitle,
    company: company,
  });
};

// Job view tracking
export const trackJobView = (jobId: string, jobTitle: string, company: string) => {
  trackEvent('job_view', {
    job_id: jobId,
    job_title: jobTitle,
    company: company,
  });
};

// Search tracking
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}; 