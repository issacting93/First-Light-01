import { useRef, useEffect } from 'react';

export interface UseAutoScrollOptions {
  enabled?: boolean;
  behavior?: ScrollBehavior;
  threshold?: number;
}

export const useAutoScroll = (options: UseAutoScrollOptions = {}) => {
  const {
    enabled = true,
    behavior = 'smooth',
    threshold = 100,
  } = options;
  
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!enabled || !ref.current) return;
    
    const element = ref.current;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;
      
      if (isNearBottom) {
        element.scrollTo({
          top: scrollHeight,
          behavior,
        });
      }
    };
    
    const observer = new MutationObserver(() => {
      handleScroll();
    });
    
    observer.observe(element, {
      childList: true,
      subtree: true,
    });
    
    return () => {
      observer.disconnect();
    };
  }, [enabled, behavior, threshold]);
  
  return ref;
}; 