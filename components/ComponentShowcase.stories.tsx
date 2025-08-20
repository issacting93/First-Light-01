import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { fn } from '@storybook/test';
import BluerayInterface from './BluerayInterface';
import AlienTranslatorInterface from './AlienTranslatorInterface';
import CombinedInterface from './CombinedInterface';
import DictionarySidebar from './DictionarySidebar';
import { MessageButton } from './MessageSidebar';
import { HexagonGrid } from './hexagon';

const meta: Meta = {
  title: 'Component Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive showcase of all First Light components with theme integration.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for components
const sampleFilms = [
  {
    id: 'showcase1',
    title: 'Component Demo',
    imgUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
  },
  {
    id: 'showcase2',
    title: 'Theme Testing',
    imgUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
  }
];

const sampleSearchResults = [
  { word: 'alien', definition: 'A being from another world', category: 'noun' },
  { word: 'translate', definition: 'To convert from one language to another', category: 'verb' },
  { word: 'interface', definition: 'A point where two systems meet', category: 'noun' },
];

// Component Showcase Component
const ComponentShowcase: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const sections = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'blueray', label: 'Blueray Interface', icon: '🎬' },
    { id: 'translator', label: 'Alien Translator', icon: '👽' },
    { id: 'combined', label: 'Combined Interface', icon: '🔗' },
    { id: 'dictionary', label: 'Dictionary', icon: '📚' },
    { id: 'hexagon', label: 'Hexagon Grid', icon: '🔷' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      fontFamily: 'var(--terminal-font-family, monospace)',
    }}>
      {/* Sidebar Navigation */}
      <div style={{
        width: sidebarExpanded ? '250px' : '60px',
        backgroundColor: 'var(--terminal-bg-panel, #1e1a18)',
        borderRight: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
        transition: 'width 0.3s ease',
        padding: '20px 0',
      }}>
        <div style={{ padding: '0 20px', marginBottom: '20px' }}>
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--terminal-text-primary, #f3ede9)',
              fontSize: '20px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
          >
            {sidebarExpanded ? '◀' : '▶'}
          </button>
        </div>
        
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: activeSection === section.id 
                ? 'var(--terminal-accent-primary, #ff4e42)' 
                : 'transparent',
              border: 'none',
              color: activeSection === section.id 
                ? 'var(--terminal-text-primary, #f3ede9)' 
                : 'var(--terminal-text-secondary, #c2b8b2)',
              cursor: 'pointer',
              textAlign: sidebarExpanded ? 'left' : 'center',
              fontSize: sidebarExpanded ? '14px' : '20px',
              transition: 'all 0.2s ease',
            }}
          >
            {sidebarExpanded ? `${section.icon} ${section.label}` : section.icon}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        backgroundColor: 'var(--terminal-bg, #080C10)',
        color: 'var(--terminal-text-primary, #f3ede9)',
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
        }}>
          <h1 style={{ 
            margin: 0, 
            color: 'var(--terminal-accent-primary, #ff4e42)',
            fontSize: 'var(--terminal-font-size-3xl, 1.875rem)',
          }}>
            First Light Component Showcase
          </h1>
          <p style={{ 
            margin: '10px 0 0 0',
            color: 'var(--terminal-text-secondary, #c2b8b2)',
            fontSize: 'var(--terminal-font-size-base, 1rem)',
          }}>
            Explore all components with integrated theming and design tokens
          </p>
        </div>

        {/* Content Sections */}
        {activeSection === 'overview' && (
          <div>
            <h2>Welcome to First Light</h2>
            <p>This showcase demonstrates all your components with:</p>
            <ul>
              <li>🎨 Integrated theme system</li>
              <li>🎭 Multiple theme options</li>
              <li>🔧 Design token integration</li>
              <li>📱 Responsive layouts</li>
              <li>⚡ Interactive demos</li>
            </ul>
            <p>Use the sidebar to navigate between different components and test them with various themes!</p>
          </div>
        )}

        {activeSection === 'blueray' && (
          <div>
            <h2>Blueray Interface</h2>
            <p>Film selector with expandable cards and scroll animations</p>
            <BluerayInterface
              films={sampleFilms}
              onFilmSelect={fn()}
              onFilmClose={fn()}
            />
          </div>
        )}

        {activeSection === 'translator' && (
          <div>
            <h2>Alien Translator Interface</h2>
            <p>Interactive alien language translation system</p>
            <AlienTranslatorInterface />
          </div>
        )}

        {activeSection === 'combined' && (
          <div>
            <h2>Combined Interface</h2>
            <p>Integrated interface combining multiple functionality modules</p>
            <CombinedInterface />
          </div>
        )}

        {activeSection === 'dictionary' && (
          <div>
            <h2>Dictionary Sidebar</h2>
            <p>Reference and search functionality</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <DictionarySidebar
                searchResults={sampleSearchResults}
                isExpanded={true}
                onWordSelect={fn()}
                onSearch={fn()}
                onClose={fn()}
              />
              <div style={{ flex: 1 }}>
                <h3>Component Information</h3>
                <p>This sidebar provides dictionary lookup and search functionality.</p>
                <p>Features include:</p>
                <ul>
                  <li>Word search and lookup</li>
                  <li>Recent words history</li>
                  <li>Expandable/collapsible interface</li>
                  <li>Integrated with theme system</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'hexagon' && (
          <div>
            <h2>Hexagon Grid</h2>
            <p>Geometric hexagon layout system</p>
            <HexagonGrid
              rows={4}
              cols={6}
              hexagonSize={50}
              onHexagonClick={fn()}
              onHexagonHover={fn()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const Showcase: Story = {
  render: () => <ComponentShowcase />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive showcase of all First Light components with theme switching capabilities.',
      },
    },
  },
};

export const IndividualComponents: Story = {
  render: () => (
    <div style={{ padding: '20px', display: 'grid', gap: '40px' }}>
      <div>
        <h2>Blueray Interface</h2>
        <BluerayInterface
          films={sampleFilms}
          onFilmSelect={fn()}
          onFilmClose={fn()}
        />
      </div>
      
      <div>
        <h2>Alien Translator</h2>
        <AlienTranslatorInterface />
      </div>
      
      <div>
        <h2>Hexagon Grid</h2>
        <HexagonGrid
          rows={3}
          cols={5}
          hexagonSize={60}
          onHexagonClick={fn()}
          onHexagonHover={fn()}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All components displayed individually for focused testing.',
      },
    },
  },
};
