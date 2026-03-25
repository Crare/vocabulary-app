declare global {
  interface Window {
    goatcounter?: {
      count: (vars: {
        path: string;
        title?: string;
        ref?: string;
        [key: string]: any;
      }) => void;
    };
  }
}

export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  if (window.goatcounter?.count) {
    window.goatcounter.count({
      path: `/event/${eventName}`,
      title: eventName,
      ...props,
    });
  }
};

export const trackPageView = (pageName: string) => {
  if (window.goatcounter?.count) {
    window.goatcounter.count({
      path: `/${pageName}`,
      title: pageName,
    });
  }
};
