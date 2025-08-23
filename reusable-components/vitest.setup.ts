import '@testing-library/jest-dom';

// Mock window.requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
  return 1;
};

// Mock window.cancelAnimationFrame
global.cancelAnimationFrame = () => {};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 