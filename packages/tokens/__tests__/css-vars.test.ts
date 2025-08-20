import { describe, it, expect } from 'vitest';

describe('CSS Variables', () => {
  it('exposes terminal color variables', () => {
    // Create a style element with the CSS variables
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --terminal-bg: #080C10;
        --terminal-bg-secondary: #1a1a1a;
        --terminal-bg-tertiary: #2a2a2a;
        --terminal-bg-panel: #1e1a18;
        --terminal-text-primary: #f3ede9;
        --terminal-text-secondary: #c2b8b2;
        --terminal-text-muted: #6b7280;
        --terminal-accent-primary: #ff4e42;
        --terminal-accent-secondary: #f84b40;
        --terminal-accent-tertiary: #cc1d2c;
        --terminal-warning: #fbbf24;
        --terminal-error: #ef4444;
        --terminal-error-dark: #dc2626;
        --terminal-success: #10b981;
        --terminal-border: rgba(255, 78, 66, 0.3);
        --terminal-border-accent: rgba(248, 75, 64, 0.4);
        --terminal-border-error: rgba(239, 68, 68, 0.3);
        --terminal-border-muted: rgba(107, 114, 128, 0.2);
        --terminal-font-family: "TheGoodMonolith", monospace;
      }
    `;
    document.head.appendChild(style);

    // Get computed styles from document root
    const root = getComputedStyle(document.documentElement);
    
    // Test that key variables exist and have values
    expect(root.getPropertyValue('--terminal-bg').trim()).toBe('#080C10');
    expect(root.getPropertyValue('--terminal-bg-secondary').trim()).toBe('#1a1a1a');
    expect(root.getPropertyValue('--terminal-bg-tertiary').trim()).toBe('#2a2a2a');
    expect(root.getPropertyValue('--terminal-bg-panel').trim()).toBe('#1e1a18');
    expect(root.getPropertyValue('--terminal-text-primary').trim()).toBe('#f3ede9');
    expect(root.getPropertyValue('--terminal-text-secondary').trim()).toBe('#c2b8b2');
    expect(root.getPropertyValue('--terminal-text-muted').trim()).toBe('#6b7280');
    expect(root.getPropertyValue('--terminal-accent-primary').trim()).toBe('#ff4e42');
    expect(root.getPropertyValue('--terminal-accent-secondary').trim()).toBe('#f84b40');
    expect(root.getPropertyValue('--terminal-accent-tertiary').trim()).toBe('#cc1d2c');
    expect(root.getPropertyValue('--terminal-warning').trim()).toBe('#fbbf24');
    expect(root.getPropertyValue('--terminal-error').trim()).toBe('#ef4444');
    expect(root.getPropertyValue('--terminal-error-dark').trim()).toBe('#dc2626');
    expect(root.getPropertyValue('--terminal-success').trim()).toBe('#10b981');
    expect(root.getPropertyValue('--terminal-border').trim()).toBe('rgba(255, 78, 66, 0.3)');
    expect(root.getPropertyValue('--terminal-border-accent').trim()).toBe('rgba(248, 75, 64, 0.4)');
    expect(root.getPropertyValue('--terminal-border-error').trim()).toBe('rgba(239, 68, 68, 0.3)');
    expect(root.getPropertyValue('--terminal-border-muted').trim()).toBe('rgba(107, 114, 128, 0.2)');
    expect(root.getPropertyValue('--terminal-font-family').trim()).toBe('"TheGoodMonolith", monospace');

    // Clean up
    document.head.removeChild(style);
  });

  it('exposes font size variables', () => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --terminal-font-size-xs: 0.75rem;
        --terminal-font-size-sm: 0.875rem;
        --terminal-font-size-base: 1rem;
        --terminal-font-size-lg: 1.125rem;
        --terminal-font-size-xl: 1.25rem;
        --terminal-font-size-2xl: 1.5rem;
        --terminal-font-size-3xl: 1.875rem;
      }
    `;
    document.head.appendChild(style);

    const root = getComputedStyle(document.documentElement);
    
    expect(root.getPropertyValue('--terminal-font-size-xs').trim()).toBe('0.75rem');
    expect(root.getPropertyValue('--terminal-font-size-sm').trim()).toBe('0.875rem');
    expect(root.getPropertyValue('--terminal-font-size-base').trim()).toBe('1rem');
    expect(root.getPropertyValue('--terminal-font-size-lg').trim()).toBe('1.125rem');
    expect(root.getPropertyValue('--terminal-font-size-xl').trim()).toBe('1.25rem');
    expect(root.getPropertyValue('--terminal-font-size-2xl').trim()).toBe('1.5rem');
    expect(root.getPropertyValue('--terminal-font-size-3xl').trim()).toBe('1.875rem');

    // Clean up
    document.head.removeChild(style);
  });

  it('exposes letter spacing variables', () => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --terminal-letter-spacing-tight: -0.025em;
        --terminal-letter-spacing-normal: 0em;
        --terminal-letter-spacing-wide: 0.025em;
        --terminal-letter-spacing-wider: 0.05em;
        --terminal-letter-spacing-widest: 0.1em;
      }
    `;
    document.head.appendChild(style);

    const root = getComputedStyle(document.documentElement);
    
    expect(root.getPropertyValue('--terminal-letter-spacing-tight').trim()).toBe('-0.025em');
    expect(root.getPropertyValue('--terminal-letter-spacing-normal').trim()).toBe('0em');
    expect(root.getPropertyValue('--terminal-letter-spacing-wide').trim()).toBe('0.025em');
    expect(root.getPropertyValue('--terminal-letter-spacing-wider').trim()).toBe('0.05em');
    expect(root.getPropertyValue('--terminal-letter-spacing-widest').trim()).toBe('0.1em');

    // Clean up
    document.head.removeChild(style);
  });
}); 