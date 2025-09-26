import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

// Performance metrics interface (for future use)
// interface PerformanceMetrics {
//   name: string;
//   value: number;
//   delta?: number;
//   id?: string;
//   rating?: 'good' | 'needs-improvement' | 'poor';
// }

export const usePerformanceMonitoring = () => {
  const { trackCustomEvent } = useAnalytics();

  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Track Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime;
            const rating = lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor';
            
            trackCustomEvent('web_vital_lcp', {
              value: Math.round(lcp),
              rating,
              metric_type: 'lcp'
            });
          }
        }
      });

      // Track First Input Delay (FID) - approximation with First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcp = entry.startTime;
            const rating = fcp <= 1800 ? 'good' : fcp <= 3000 ? 'needs-improvement' : 'poor';
            
            trackCustomEvent('web_vital_fcp', {
              value: Math.round(fcp),
              rating,
              metric_type: 'fcp'
            });
          }
        }
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }

      // Track Cumulative Layout Shift (CLS) - simplified version
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        
        // Report CLS after 5 seconds
        setTimeout(() => {
          const rating = clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor';
          trackCustomEvent('web_vital_cls', {
            value: Math.round(clsValue * 1000), // Convert to milliseconds for easier tracking
            rating,
            metric_type: 'cls'
          });
        }, 5000);
      } catch (error) {
        console.warn('Layout shift monitoring not supported:', error);
      }
    };

    // Track page load performance
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp_connect: navigation.connectEnd - navigation.connectStart,
            server_response: navigation.responseStart - navigation.requestStart,
            dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            page_load: navigation.loadEventEnd - navigation.fetchStart,
          };

          // Track each metric
          Object.entries(metrics).forEach(([name, value]) => {
            if (value > 0) {
              trackCustomEvent('page_performance', {
                metric_name: name,
                value: Math.round(value),
                metric_type: 'timing'
              });
            }
          });
        }
      }
    };

    // Track resource loading performance
    const trackResourcePerformance = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        const resourceMetrics = {
          scripts: [] as number[],
          stylesheets: [] as number[],
          images: [] as number[],
          fonts: [] as number[],
        };

        resources.forEach((resource) => {
          const duration = resource.responseEnd - resource.startTime;
          
          if (resource.name.includes('.js')) {
            resourceMetrics.scripts.push(duration);
          } else if (resource.name.includes('.css')) {
            resourceMetrics.stylesheets.push(duration);
          } else if (resource.name.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
            resourceMetrics.images.push(duration);
          } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) {
            resourceMetrics.fonts.push(duration);
          }
        });

        // Track average load times for each resource type
        Object.entries(resourceMetrics).forEach(([type, durations]) => {
          if (durations.length > 0) {
            const average = durations.reduce((a, b) => a + b, 0) / durations.length;
            trackCustomEvent('resource_performance', {
              resource_type: type,
              average_load_time: Math.round(average),
              resource_count: durations.length,
              metric_type: 'resource'
            });
          }
        });
      }
    };

    // Track memory usage (if available)
    const trackMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        trackCustomEvent('memory_usage', {
          used_heap: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
          total_heap: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
          heap_limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
          metric_type: 'memory'
        });
      }
    };

    // Run performance tracking after page load
    const runPerformanceTracking = () => {
      // Wait a bit for the page to fully load
      setTimeout(() => {
        trackWebVitals();
        trackPageLoad();
        trackResourcePerformance();
        trackMemoryUsage();
      }, 1000);
    };

    // Run immediately if page is already loaded, otherwise wait for load event
    if (document.readyState === 'complete') {
      runPerformanceTracking();
    } else {
      window.addEventListener('load', runPerformanceTracking);
      return () => window.removeEventListener('load', runPerformanceTracking);
    }
  }, [trackCustomEvent]);

  // Manual performance tracking functions
  const trackCustomMetric = (name: string, value: number, metadata?: Record<string, any>) => {
    trackCustomEvent('custom_performance_metric', {
      metric_name: name,
      value: Math.round(value),
      ...metadata,
      metric_type: 'custom'
    });
  };

  const measureFunction = <T extends (...args: any[]) => any>(
    fn: T,
    functionName: string
  ): T => {
    return ((...args: any[]) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      trackCustomMetric(`function_${functionName}`, end - start, {
        function_name: functionName
      });
      
      return result;
    }) as T;
  };

  const measureAsync = async <T>(
    asyncFn: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await asyncFn();
      const end = performance.now();
      
      trackCustomMetric(`async_${operationName}`, end - start, {
        operation_name: operationName,
        status: 'success'
      });
      
      return result;
    } catch (error) {
      const end = performance.now();
      
      trackCustomMetric(`async_${operationName}`, end - start, {
        operation_name: operationName,
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  };

  return {
    trackCustomMetric,
    measureFunction,
    measureAsync,
  };
};