import '@testing-library/jest-dom';

// Mock window.requestAnimationFrame
(window as any).requestAnimationFrame = (callback: FrameRequestCallback) => {
  setTimeout(callback, 0);
  return 1;
};

// Mock window.cancelAnimationFrame
(window as any).cancelAnimationFrame = () => {};

// Mock ResizeObserver
(window as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 