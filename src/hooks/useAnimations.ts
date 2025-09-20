import { useEffect, useRef, useCallback } from 'react';
import { animations, initializePageAnimations } from '../utils/animations';

interface UseAnimationsOptions {
  autoInitialize?: boolean;
  entrance?: 'fadeInUp' | 'slideInRight' | 'scaleIn' | 'staggerIn';
  delay?: number;
}

export const useAnimations = (options: UseAnimationsOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const { autoInitialize = true, entrance = 'fadeInUp', delay = 0 } = options;

  // Initialize entrance animation when component mounts
  useEffect(() => {
    if (autoInitialize && elementRef.current) {
      const timer = setTimeout(() => {
        if (elementRef.current) {
          animations[entrance](elementRef.current, { delay });
        }
      }, 50); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    }
  }, [autoInitialize, entrance, delay]);

  // Manual animation triggers
  const animate = useCallback((
    animationType: keyof typeof animations,
    target?: string | Element | NodeList,
    options = {}
  ) => {
    const animationTarget = target || elementRef.current;
    if (animationTarget && animations[animationType]) {
      return animations[animationType](animationTarget, options);
    }
  }, []);

  const fadeIn = useCallback((target?: string | Element | NodeList, options = {}) => {
    return animate('fadeInUp', target, options);
  }, [animate]);

  const slideIn = useCallback((target?: string | Element | NodeList, options = {}) => {
    return animate('slideInRight', target, options);
  }, [animate]);

  const scaleIn = useCallback((target?: string | Element | NodeList, options = {}) => {
    return animate('scaleIn', target, options);
  }, [animate]);

  const bounceIn = useCallback((target?: string | Element | NodeList, options = {}) => {
    return animate('bounceIn', target, options);
  }, [animate]);

  const stagger = useCallback((target?: string | Element | NodeList, options = {}) => {
    return animate('staggerIn', target, options);
  }, [animate]);

  const pulse = useCallback((target?: string | Element | NodeList, options = {}) => {
    return animate('pulse', target, options);
  }, [animate]);

  return {
    ref: elementRef,
    animate,
    fadeIn,
    slideIn,
    scaleIn,
    bounceIn,
    stagger,
    pulse,
    animations
  };
};

// Hook for page-level animations
export const usePageAnimations = () => {
  useEffect(() => {
    // Initialize page animations after a brief delay
    const timer = setTimeout(() => {
      initializePageAnimations();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    initializePageAnimations
  };
};

// Hook for step-based animations (for CalculatorPage)
export const useStepAnimations = (currentStep: number) => {
  const stepRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (stepRef.current) {
      // Animate step transition
      animations.slideInRight(stepRef.current, { delay: 100 });
    }
  }, [currentStep]);

  return {
    stepRef
  };
};

export default useAnimations;