import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import DictionarySidebar from './DictionarySidebar';

const meta: Meta<typeof DictionarySidebar> = {
  title: 'Components/DictionarySidebar',
  component: DictionarySidebar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A sidebar component that provides dictionary and reference functionality.',
      },
    },
  },
  argTypes: {
    onWordSelect: { action: 'word-selected' },
    onSearch: { action: 'search-performed' },
    onClose: { action: 'sidebar-closed' },
  },
  args: {
    onWordSelect: fn(),
    onSearch: fn(),
    onClose: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithSearchResults: Story = {
  args: {
    searchResults: [
      { word: 'alien', definition: 'A being from another world', category: 'noun' },
      { word: 'translate', definition: 'To convert from one language to another', category: 'verb' },
      { word: 'interface', definition: 'A point where two systems meet', category: 'noun' },
    ],
  },
};

export const WithRecentWords: Story = {
  args: {
    recentWords: ['alien', 'translate', 'interface', 'communication'],
  },
};

export const Expanded: Story = {
  args: {
    isExpanded: true,
    searchResults: [
      { word: 'alien', definition: 'A being from another world', category: 'noun' },
      { word: 'translate', definition: 'To convert from one language to another', category: 'verb' },
    ],
  },
};

export const Collapsed: Story = {
  args: {
    isExpanded: false,
  },
};

export const Interactive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Interactive story - try searching for words and selecting them.',
      },
    },
  },
};
