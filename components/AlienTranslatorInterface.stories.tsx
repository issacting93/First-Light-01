import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import AlienTranslatorInterface from './AlienTranslatorInterface';

const meta: Meta<typeof AlienTranslatorInterface> = {
  title: 'Components/AlienTranslatorInterface',
  component: AlienTranslatorInterface,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An alien language translator interface with interactive translation capabilities.',
      },
    },
  },
  argTypes: {
    onTranslate: { action: 'translation-requested' },
    onReset: { action: 'translation-reset' },
  },
  args: {
    onTranslate: fn(),
    onReset: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithInitialText: Story = {
  args: {
    initialText: 'Hello, world!',
  },
};

export const WithAlienResponse: Story = {
  args: {
    initialText: 'Greetings from Earth',
    alienResponse: 'Kzzt! Xylophone resonance detected in quadrant 7!',
  },
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
    initialText: 'Processing alien communication...',
  },
};

export const ErrorState: Story = {
  args: {
    hasError: true,
    errorMessage: 'Translation matrix overloaded. Please try again.',
    initialText: 'Failed translation attempt',
  },
};

export const Interactive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive story - try typing in the translator to see it in action.',
      },
    },
  },
};
