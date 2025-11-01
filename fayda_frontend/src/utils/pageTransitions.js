/**
 * Page Transition Utilities
 * Provides consistent page transitions for seamless navigation
 */

export const pageTransitionStyles = {
  container: {
    minHeight: '100vh',
    animation: 'fadeIn 0.4s ease-out',
    backgroundColor: 'var(--color-bg)',
  },
  
  content: {
    animation: 'slideInUp 0.5s ease-out',
  },
  
  card: {
    animation: 'fadeInScale 0.6s ease-out',
  }
};

// Add to index.css animations
export const pageTransitionKeyframes = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`;

