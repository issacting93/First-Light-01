// Import your design tokens
import '../packages/tokens/src/styles.css';

// Simple theme configuration for Storybook 9
// Note: @storybook/theming/create is not fully compatible with Storybook 9 yet
// This provides basic theme structure that can be enhanced later

// First Light Theme (Dark)
export const firstLightDark = {
  base: 'dark',
  
  // Brand
  brandTitle: 'First Light',
  brandUrl: 'https://github.com/your-username/First-Light',
  brandImage: undefined,
  brandTarget: '_self',

  // Colors
  colorPrimary: '#ff4e42',
  colorSecondary: '#f84b40',
  
  // UI
  appBg: '#080C10',
  appContentBg: '#1a1a1a',
  appBorderColor: 'rgba(255, 78, 66, 0.3)',
  appBorderRadius: 8,

  // Text colors
  textColor: '#f3ede9',
  textInverseColor: '#080C10',
  textMutedColor: '#6b7280',

  // Toolbar default and active colors
  barTextColor: '#c2b8b2',
  barSelectedColor: '#ff4e42',
  barBg: '#1e1a18',

  // Form colors
  inputBg: '#2a2a2a',
  inputBorder: 'rgba(107, 114, 128, 0.2)',
  inputTextColor: '#f3ede9',
  inputBorderRadius: 4,

  // Button colors
  buttonBg: '#2a2a2a',
  buttonBorder: 'rgba(255, 78, 66, 0.3)',
  buttonTextColor: '#f3ede9',
  booleanBg: '#1a1a1a',
  booleanSelectedBg: '#ff4e42',

  // Status colors
  colorSuccess: '#10b981',
  colorWarning: '#fbbf24',
  colorError: '#ef4444',
  colorCritical: '#dc2626',

  // Font
  fontBase: '"TheGoodMonolith", monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"TheGoodMonolith", monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
};

// First Light Theme (Light)
export const firstLightLight = {
  base: 'light',
  
  // Brand
  brandTitle: 'First Light',
  brandUrl: 'https://github.com/your-username/First-Light',
  brandImage: undefined,
  brandTarget: '_self',

  // Colors
  colorPrimary: '#ff4e42',
  colorSecondary: '#f84b40',
  
  // UI
  appBg: '#ffffff',
  appContentBg: '#f9fafb',
  appBorderColor: 'rgba(255, 78, 66, 0.2)',
  appBorderRadius: 8,

  // Text colors
  textColor: '#1f2937',
  textInverseColor: '#ffffff',
  textMutedColor: '#6b7280',

  // Toolbar default and active colors
  barTextColor: '#374151',
  barSelectedColor: '#ff4e42',
  barBg: '#f3f4f6',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#1f2937',
  inputBorderRadius: 4,

  // Button colors
  buttonBg: '#ffffff',
  buttonBorder: '#d1d5db',
  buttonTextColor: '#1f2937',
  booleanBg: '#f3f4f6',
  booleanSelectedBg: '#ff4e42',

  // Status colors
  colorSuccess: '#059669',
  colorWarning: '#d97706',
  colorError: '#dc2626',
  colorCritical: '#b91c1c',

  // Font
  fontBase: '"TheGoodMonolith", monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"TheGoodMonolith", monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
};

// Terminal Theme
export const terminalTheme = {
  base: 'dark',
  
  // Brand
  brandTitle: 'First Light - Terminal',
  brandUrl: 'https://github.com/your-username/First-Light',
  brandImage: undefined,
  brandTarget: '_self',

  // Colors
  colorPrimary: '#ff4e42',
  colorSecondary: '#f84b40',
  
  // UI
  appBg: '#000000',
  appContentBg: '#0a0a0a',
  appBorderColor: 'rgba(255, 78, 66, 0.4)',
  appBorderRadius: 0,

  // Text colors
  textColor: '#f3ede9',
  textInverseColor: '#000000',
  textMutedColor: '#6b7280',

  // Toolbar default and active colors
  barTextColor: '#c2b8b2',
  barSelectedColor: '#ff4e42',
  barBg: '#0f0f0f',

  // Form colors
  inputBg: '#1a1a1a',
  inputBorder: 'rgba(107, 114, 128, 0.3)',
  inputTextColor: '#f3ede9',
  inputBorderRadius: 0,

  // Button colors
  buttonBg: '#1a1a1a',
  buttonBorder: 'rgba(255, 78, 66, 0.3)',
  buttonTextColor: '#f3ede9',
  booleanBg: '#0a0a0a',
  booleanSelectedBg: '#ff4e42',

  // Status colors
  colorSuccess: '#10b981',
  colorWarning: '#fbbf24',
  colorError: '#ef4444',
  colorCritical: '#dc2626',

  // Font
  fontBase: '"TheGoodMonolith", monospace',
  fontCode: '"TheGoodMonolith", monospace',
};

// Sci-Fi Theme
export const sciFiTheme = {
  base: 'dark',
  
  // Brand
  brandTitle: 'First Light - Sci-Fi',
  brandUrl: 'https://github.com/your-username/First-Light',
  brandImage: undefined,
  brandTarget: '_self',

  // Colors
  colorPrimary: '#00ffff',
  colorSecondary: '#ff00ff',
  
  // UI
  appBg: '#0a0a0a',
  appContentBg: '#1a1a1a',
  appBorderColor: 'rgba(0, 255, 255, 0.3)',
  appBorderRadius: 8,

  // Text colors
  textColor: '#00ffff',
  textInverseColor: '#0a0a0a',
  textMutedColor: '#4a9eff',

  // Toolbar default and active colors
  barTextColor: '#4a9eff',
  barSelectedColor: '#00ffff',
  barBg: '#0f0f0f',

  // Form colors
  inputBg: '#2a2a2a',
  inputBorder: 'rgba(0, 255, 255, 0.2)',
  inputTextColor: '#00ffff',
  inputBorderRadius: 4,

  // Button colors
  buttonBg: '#2a2a2a',
  buttonBorder: 'rgba(0, 255, 255, 0.3)',
  buttonTextColor: '#00ffff',
  booleanBg: '#1a1a1a',
  booleanSelectedBg: '#00ffff',

  // Status colors
  colorSuccess: '#00ff00',
  colorWarning: '#ffff00',
  colorError: '#ff0000',
  colorCritical: '#ff0080',

  // Font
  fontBase: '"TheGoodMonolith", monospace, "Orbitron", sans-serif',
  fontCode: '"TheGoodMonolith", monospace, "Orbitron", sans-serif',
};

// Export all themes
export const themes = {
  'First Light Dark': firstLightDark,
  'First Light Light': firstLightLight,
  'Terminal': terminalTheme,
  'Sci-Fi': sciFiTheme,
};
