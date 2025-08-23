import type { Preview } from '@storybook/react-vite';
import React from 'react';
import { themes } from './theme';
import '../components/BluerayInterface.css';
import '../src/styles/globals.css';
import '../packages/tokens/src/styles.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'First Light Dark',
          value: '#080C10',
        },
        {
          name: 'First Light Light',
          value: '#ffffff',
        },
        {
          name: 'Terminal',
          value: '#000000',
        },
        {
          name: 'Sci-Fi',
          value: '#0a0a0a',
        },
      ],
    },
    layout: 'fullscreen',
    docs: {
      theme: themes['First Light Dark'],
    },
    darkMode: {
      current: 'dark',
      dark: themes['First Light Dark'],
      light: themes['First Light Light'],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'First Light Dark',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          'First Light Dark',
          'First Light Light', 
          'Terminal',
          'Sci-Fi',
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;
      const themeConfig = themes[theme] || themes['First Light Dark'];
      
      return (
        <div 
          style={{ 
            padding: '20px', 
            minHeight: '100vh',
            backgroundColor: themeConfig.appBg,
            color: themeConfig.textColor,
            fontFamily: themeConfig.fontBase,
          }}
          className={`theme-${theme.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;