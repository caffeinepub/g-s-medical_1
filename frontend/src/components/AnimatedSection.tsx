import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
  delay?: number;
  threshold?: number;
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    // Set initial state
    element.style.opacity = '0';
    element.style.transition = `opacity 0.7s ease-out ${delay}ms, transform 0.7s ease-out ${delay}ms`;

    switch (animation) {
      case 'fade-up':
        element.style.transform = 'translateY(40px)';
        break;
      case 'fade-in':
        element.style.transform = 'none';
        break;
      case 'slide-left':
        element.style.transform = 'translateX(-40px)';
        break;
      case 'slide-right':
        element.style.transform = 'translateX(40px)';
        break;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0)';
            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [animation, delay, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
