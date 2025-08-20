import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import CombinedInterface from './CombinedInterface';

const meta: Meta<typeof CombinedInterface> = {
  title: 'Components/CombinedInterface',
  component: CombinedInterface,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A combined interface that integrates multiple functionality modules into one cohesive experience.',
      },
    },
  },
  argTypes: {
    onModuleSelect: { action: 'module-selected' },
    onInterfaceChange: { action: 'interface-changed' },
  },
  args: {
    onModuleSelect: fn(),
    onInterfaceChange: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithActiveModule: Story = {
  args: {
    activeModule: 'translator',
  },
};

export const WithCustomLayout: Story = {
  args: {
    layout: 'split',
    showSidebar: true,
  },
};

export const CompactMode: Story = {
  args: {
    layout: 'compact',
    showSidebar: false,
  },
};

export const FullScreen: Story = {
  args: {
    layout: 'fullscreen',
    showSidebar: true,
  },
};

export const Interactive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive story - try switching between different modules and layouts.',
      },
    },
  },
};
