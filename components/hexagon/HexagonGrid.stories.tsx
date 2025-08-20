import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { HexagonGrid } from './index';

const meta: Meta<typeof HexagonGrid> = {
  title: 'Components/Hexagon/HexagonGrid',
  component: HexagonGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A hexagonal grid layout component that creates a tessellating pattern of hexagons.',
      },
    },
  },
  argTypes: {
    onHexagonClick: { action: 'hexagon-clicked' },
    onHexagonHover: { action: 'hexagon-hovered' },
  },
  args: {
    onHexagonClick: fn(),
    onHexagonHover: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: 5,
    cols: 7,
  },
};

export const SmallGrid: Story = {
  args: {
    rows: 3,
    cols: 5,
  },
};

export const LargeGrid: Story = {
  args: {
    rows: 8,
    cols: 10,
  },
};

export const WithCustomSize: Story = {
  args: {
    rows: 4,
    cols: 6,
    hexagonSize: 60,
  },
};

export const WithCustomColors: Story = {
  args: {
    rows: 5,
    cols: 7,
    hexagonSize: 50,
    primaryColor: '#4f46e5',
    secondaryColor: '#7c3aed',
  },
};

export const Interactive: Story = {
  args: {
    rows: 6,
    cols: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story - try clicking and hovering over the hexagons.',
      },
    },
  },
};
