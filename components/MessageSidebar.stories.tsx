import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MessageButton } from './MessageSidebar';

const meta: Meta<typeof MessageButton> = {
  title: 'Components/MessageSidebar',
  component: MessageButton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A message sidebar component that handles communication and messaging functionality.',
      },
    },
  },
  argTypes: {
    onMessage: { action: 'message-sent' },
    onToggle: { action: 'sidebar-toggled' },
  },
  args: {
    onMessage: fn(),
    onToggle: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithUnreadMessages: Story = {
  args: {
    unreadCount: 3,
  },
};

export const WithActiveChat: Story = {
  args: {
    activeChat: 'Alien Contact #1',
    unreadCount: 1,
  },
};

export const Expanded: Story = {
  args: {
    isExpanded: true,
    activeChat: 'Alien Contact #1',
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
        story: 'Interactive story - try clicking the message button to see it in action.',
      },
    },
  },
};
