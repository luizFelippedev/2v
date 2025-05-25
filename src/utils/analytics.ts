type EventType = 
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'file_download'
  | 'form_submit'
  | 'error';

interface AnalyticsEvent {
  type: EventType;
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private static instance: Analytics;
  private initialized: boolean = false;
  private queue: AnalyticsEvent[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initGoogleAnalytics();
    }
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  private initGoogleAnalytics(): void {
    if (this.initialized) return;

    try {
      const gaId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
      if (!gaId) return;

      // Inicializar GA
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', gaId);

      this.initialized = true;
      this.processQueue();
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }

  private processQueue(): void {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) this.trackEvent(event);
    }
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    try {
      window.gtag('event', event.name, {
        event_category: event.type,
        ...event.properties,
        timestamp: event.timestamp || Date.now()
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  trackPageView(path: string): void {
    this.trackEvent({
      type: 'page_view',
      name: 'page_view',
      properties: { path }
    });
  }
}

export const analytics = Analytics.getInstance();
