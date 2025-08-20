import type { Meta, StoryObj } from '@storybook/react';
import BluerayInterface from './BluerayInterface';
import BluerayDemo from './BluerayDemo';

const meta: Meta = {
  title: 'Component Library',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A showcase of all available components in the First Light project.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BluerayInterfaceShowcase: Story = {
  render: () => <BluerayDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Complete BluerayInterface demo with sample data and all features.',
      },
    },
  },
};

export const ComponentGrid: Story = {
  render: () => (
    <div style={{ padding: '40px', display: 'grid', gap: '40px' }}>
      <div>
        <h2>BluerayInterface Component</h2>
        <BluerayDemo />
      </div>
      
      <div style={{ marginTop: '60px' }}>
        <h2>Component Information</h2>
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <h3>Available Components:</h3>
          <ul>
            <li>BluerayInterface - Film selector with expandable cards</li>
            <li>AlienTranslatorInterface - Alien language translator</li>
            <li>CombinedInterface - Combined functionality interface</li>
            <li>DictionarySidebar - Dictionary and reference sidebar</li>
            <li>MessageSidebar - Message and communication sidebar</li>
            <li>TerminalPanel - Terminal interface component</li>
            <li>Hexagon Components - Various hexagon-based UI elements</li>
          </ul>
          
          <h3>Features:</h3>
          <ul>
            <li>Responsive design for all screen sizes</li>
            <li>TypeScript support with full type safety</li>
            <li>CSS animations and transitions</li>
            <li>Template system for custom content</li>
            <li>Accessibility features and ARIA support</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive view of all available components and their features.',
      },
    },
  },
};
