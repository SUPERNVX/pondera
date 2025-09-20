// Simple CSS-based animations that work without external libraries
// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface AnimationOptions {
  duration?: number;
  delay?: number;
  stagger?: number;
  [key: string]: unknown; // Permite propriedades adicionais
}

// Simple animation functions using CSS classes and transforms
export const animations = {
  // Page entrance animation - subtle fade in from bottom
  fadeInUp: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 500;
    const delay = options.delay || 0;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const promises: Promise<void>[] = [];
        
        Array.from(elements).forEach((element, index) => {
          const el = element as HTMLElement;
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, (options.stagger || 0) * index);
          
          promises.push(new Promise<void>((resolveElement) => {
            setTimeout(() => resolveElement(), duration + (options.stagger || 0) * index);
          }));
        });
        
        Promise.all(promises).then(() => resolve());
      }, delay);
    });
  },

  // Step transition - smooth slide from right
  slideInRight: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 400;
    const delay = options.delay || 0;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        Array.from(elements).forEach((element) => {
          const el = element as HTMLElement;
          el.style.opacity = '0';
          el.style.transform = 'translateX(30px)';
          el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          });
        });
        
        setTimeout(() => resolve(), duration + delay);
      }, delay);
    });
  },

  // Modal and card entrance - gentle scale in
  scaleIn: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 300;
    const delay = options.delay || 0;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        Array.from(elements).forEach((element) => {
          const el = element as HTMLElement;
          el.style.opacity = '0';
          el.style.transform = 'scale(0.95)';
          el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
          });
        });
        
        setTimeout(() => resolve(), duration + delay);
      }, delay);
    });
  },

  // Button hover enhancement - subtle scale and glow
  buttonHover: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 200;
    
    Array.from(elements).forEach((element) => {
      const el = element as HTMLElement;
      el.style.transform = 'scale(1.02)';
      el.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, duration);
    });
    
    return Promise.resolve();
  },

  // Staggered animation for lists
  staggerIn: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 350;
    const staggerDelay = 50;
    const baseDelay = options.delay || 0;
    
    return new Promise<void>((resolve) => {
      Array.from(elements).forEach((element, index) => {
        const el = element as HTMLElement;
        const totalDelay = baseDelay + (staggerDelay * index);
        
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, totalDelay);
      });
      
      const totalDuration = baseDelay + (staggerDelay * elements.length) + duration;
      setTimeout(() => resolve(), totalDuration);
    });
  },

  // Notification entrance - subtle bounce
  bounceIn: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 400;
    const delay = options.delay || 0;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        Array.from(elements).forEach((element) => {
          const el = element as HTMLElement;
          el.style.opacity = '0';
          el.style.transform = 'scale(0.8)';
          el.style.transition = `all ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
          
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
          });
        });
        
        setTimeout(() => resolve(), duration + delay);
      }, delay);
    });
  },

  // Loading pulse animation - corrigido: removido parâmetro options não utilizado
  pulse: (targets: string | Element | NodeList) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    Array.from(elements).forEach((element) => {
      const el = element as HTMLElement;
      el.style.animation = 'pulse 1.5s ease-in-out infinite alternate';
    });
    
    return Promise.resolve();
  },

  // Smooth fade out
  fadeOut: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 300;
    const delay = options.delay || 0;
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        Array.from(elements).forEach((element) => {
          const el = element as HTMLElement;
          el.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          el.style.opacity = '0';
          el.style.transform = 'translateY(-10px)';
        });
        
        setTimeout(() => resolve(), duration + delay);
      }, delay);
    });
  },

  // Focus animation for form elements
  focusIn: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 150;
    
    Array.from(elements).forEach((element) => {
      const el = element as HTMLElement;
      el.style.transform = 'scale(1.01)';
      el.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    });
    
    return Promise.resolve();
  },

  // Theme transition animation
  themeTransition: (targets: string | Element | NodeList, options: AnimationOptions = {}) => {
    if (prefersReducedMotion()) return Promise.resolve();
    
    const elements = typeof targets === 'string' ? 
      document.querySelectorAll(targets) : 
      targets instanceof NodeList ? targets : [targets as Element];
    
    const duration = options.duration || 600;
    
    Array.from(elements).forEach((element) => {
      const el = element as HTMLElement;
      el.style.transform = 'rotateY(360deg)';
      el.style.transition = `transform ${duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
      
      setTimeout(() => {
        el.style.transform = 'rotateY(0deg)';
      }, duration);
    });
    
    return Promise.resolve();
  }
};

// Utility function to animate page transitions
export const animatePageTransition = async (entering: Element, exiting?: Element) => {
  if (prefersReducedMotion()) return;
  
  if (exiting) {
    await animations.fadeOut(exiting, { duration: 200 });
  }
  
  await animations.fadeInUp(entering, { duration: 400, delay: exiting ? 150 : 0 });
};

// Initialize animations on component mount
export const initializePageAnimations = () => {
  if (prefersReducedMotion()) return;
  
  // Animate main content containers
  const mainContainers = document.querySelectorAll('main, section, .page-container');
  if (mainContainers.length > 0) {
    animations.fadeInUp(mainContainers, { delay: 100 });
  }

  // Animate cards and important sections
  const cards = document.querySelectorAll('.card, [class*="card"], .section-card');
  if (cards.length > 0) {
    animations.staggerIn(cards, { delay: 200 });
  }
};

export default animations;