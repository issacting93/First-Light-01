import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import BluerayInterface from './BluerayInterface';

const meta: Meta<typeof BluerayInterface> = {
  title: 'Components/BluerayInterface',
  component: BluerayInterface,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A film/Blu-ray selector interface with expandable cards, scroll-based animations, and responsive design.',
      },
    },
  },
  argTypes: {
    onFilmSelect: { action: 'film-selected' },
    onFilmClose: { action: 'film-closed' },
  },
  args: {
    onFilmSelect: fn(),
    onFilmClose: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample film data
const sampleFilms = [
  {
    id: 'item01',
    title: 'The Matrix',
    imgUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'item02',
    title: 'Blade Runner',
    imgUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'item03',
    title: 'Inception',
    imgUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'item04',
    title: 'Interstellar',
    imgUrl: 'https://images.unsplash.com/photo-1446776811953-b23d0bd63ac2?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  {
    id: 'item05',
    title: 'Arrival',
    imgUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    trailer: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  }
];

const sciFiFilms = [
  {
    id: 'scifi01',
    title: '2001: A Space Odyssey',
    imgUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
  },
  {
    id: 'scifi02',
    title: 'Akira',
    imgUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
  },
  {
    id: 'scifi03',
    title: 'Ghost in the Shell',
    imgUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
  }
];

export const Default: Story = {
  args: {
    films: sampleFilms,
  },
};

export const SciFiCollection: Story = {
  args: {
    films: sciFiFilms,
  },
  parameters: {
    docs: {
      description: {
        story: 'A smaller collection of sci-fi films to demonstrate different layouts.',
      },
    },
  },
};

export const SingleFilm: Story = {
  args: {
    films: [sampleFilms[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'Single film display for focused viewing.',
      },
    },
  },
};

export const WithTrailers: Story = {
  args: {
    films: sampleFilms.filter(film => film.trailer),
  },
  parameters: {
    docs: {
      description: {
        story: 'Films with trailer support - click to view video overlays.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    films: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no films are provided.',
      },
    },
  },
};

// Interactive story with state management
export const Interactive: Story = {
  args: {
    films: sampleFilms,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story with full state management - try clicking on films to see the different states.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    // This story demonstrates the interactive behavior
    // Users can click on films to see the different states
  },
};
