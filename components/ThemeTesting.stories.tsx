import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { fn } from '@storybook/test';
import BluerayInterface from './BluerayInterface';
import AlienTranslatorInterface from './AlienTranslatorInterface';
import { HexagonGrid } from './hexagon';

const meta: Meta = {
  title: 'Theme Testing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Test how all components look with different themes and design tokens.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const sampleFilms = [
  {
    id: 'theme1',
    title: 'Theme Testing Film',
    imgUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
  },
  {
    id: 'theme2',
    title: 'Design Token Demo',
    imgUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
  }
];

// Theme Testing Component
const ThemeTestingComponent: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px',
      minHeight: '100vh',
      fontFamily: 'var(--terminal-font-family, monospace)',
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: 'var(--terminal-bg-panel, #1e1a18)',
        border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
        borderRadius: '8px',
      }}>
        <h1 style={{ 
          margin: 0,
          color: 'var(--terminal-accent-primary, #ff4e42)',
          fontSize: 'var(--terminal-font-size-3xl, 1.875rem)',
          marginBottom: '10px',
        }}>
          🎨 Theme Testing Center
        </h1>
        <p style={{ 
          margin: 0,
          color: 'var(--terminal-text-secondary, #c2b8b2)',
          fontSize: 'var(--terminal-font-size-base, 1rem)',
        }}>
          Use the Storybook toolbar to switch between themes and see how components adapt!
        </p>
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'var(--terminal-bg-tertiary, #2a2a2a)',
          borderRadius: '4px',
          border: '1px solid var(--terminal-border-muted, rgba(107, 114, 128, 0.2))',
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0',
            color: 'var(--terminal-text-primary, #f3ede9)',
            fontSize: 'var(--terminal-font-size-lg, 1.125rem)',
          }}>
            Available Themes:
          </h3>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            {['First Light Dark', 'First Light Light', 'Terminal', 'Sci-Fi'].map(theme => (
              <div key={theme} style={{
                padding: '8px 16px',
                backgroundColor: 'var(--terminal-bg, #080C10)',
                border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
                borderRadius: '4px',
                color: 'var(--terminal-text-primary, #f3ede9)',
                fontSize: 'var(--terminal-font-size-sm, 0.875rem)',
              }}>
                {theme}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Design Token Display */}
      <div style={{ 
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: 'var(--terminal-bg-secondary, #1a1a1a)',
        border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
        borderRadius: '8px',
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0',
          color: 'var(--terminal-accent-primary, #ff4e42)',
          fontSize: 'var(--terminal-font-size-2xl, 1.5rem)',
        }}>
          🎯 Design Token Preview
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          {/* Color Tokens */}
          <div>
            <h3 style={{ 
              margin: '0 0 15px 0',
              color: 'var(--terminal-text-primary, #f3ede9)',
              fontSize: 'var(--terminal-font-size-lg, 1.125rem)',
            }}>
              Colors
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--terminal-accent-primary, #ff4e42)',
                  borderRadius: '4px',
                }} />
                <span style={{ color: 'var(--terminal-text-secondary, #c2b8b2)', fontSize: 'var(--terminal-font-size-sm, 0.875rem)' }}>
                  Primary: var(--terminal-accent-primary)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--terminal-accent-secondary, #f84b40)',
                  borderRadius: '4px',
                }} />
                <span style={{ color: 'var(--terminal-text-secondary, #c2b8b2)', fontSize: 'var(--terminal-font-size-sm, 0.875rem)' }}>
                  Secondary: var(--terminal-accent-secondary)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'var(--terminal-success, #10b981)',
                  borderRadius: '4px',
                }} />
                <span style={{ color: 'var(--terminal-text-secondary, #c2b8b2)', fontSize: 'var(--terminal-font-size-sm, 0.875rem)' }}>
                  Success: var(--terminal-success)
                </span>
              </div>
            </div>
          </div>

          {/* Typography Tokens */}
          <div>
            <h3 style={{ 
              margin: '0 0 15px 0',
              color: 'var(--terminal-text-primary, #f3ede9)',
              fontSize: 'var(--terminal-font-size-lg, 1.125rem)',
            }}>
              Typography
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ 
                color: 'var(--terminal-text-primary, #f3ede9)',
                fontSize: 'var(--terminal-font-size-3xl, 1.875rem)',
                fontFamily: 'var(--terminal-font-family, monospace)',
              }}>
                Large Text
              </div>
              <div style={{ 
                color: 'var(--terminal-text-secondary, #c2b8b2)',
                fontSize: 'var(--terminal-font-size-base, 1rem)',
                fontFamily: 'var(--terminal-font-family, monospace)',
              }}>
                Base Text
              </div>
              <div style={{ 
                color: 'var(--terminal-text-muted, #6b7280)',
                fontSize: 'var(--terminal-font-size-sm, 0.875rem)',
                fontFamily: 'var(--terminal-font-family, monospace)',
              }}>
                Small Text
              </div>
            </div>
          </div>

          {/* Spacing Tokens */}
          <div>
            <h3 style={{ 
              margin: '0 0 15px 0',
              color: 'var(--terminal-text-primary, #f3ede9)',
              fontSize: 'var(--terminal-font-size-lg, 1.125rem)',
            }}>
              Spacing & Borders
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                padding: '10px',
                backgroundColor: 'var(--terminal-bg-tertiary, #2a2a2a)',
                border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
                borderRadius: '4px',
                color: 'var(--terminal-text-primary, #f3ede9)',
              }}>
                Border Example
              </div>
              <div style={{
                padding: '10px',
                backgroundColor: 'var(--terminal-bg-panel, #1e1a18)',
                border: '1px solid var(--terminal-border-muted, rgba(107, 114, 128, 0.2))',
                borderRadius: '4px',
                color: 'var(--terminal-text-secondary, #c2b8b2)',
              }}>
                Muted Border
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Component Testing Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '30px',
      }}>
        {/* Blueray Interface */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--terminal-bg-secondary, #1a1a1a)',
          border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
          borderRadius: '8px',
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            color: 'var(--terminal-accent-primary, #ff4e42)',
            fontSize: 'var(--terminal-font-size-xl, 1.25rem)',
          }}>
            🎬 Blueray Interface
          </h3>
          <BluerayInterface
            films={sampleFilms}
            onFilmSelect={fn()}
            onFilmClose={fn()}
          />
        </div>

        {/* Alien Translator */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--terminal-bg-secondary, #1a1a1a)',
          border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
          borderRadius: '8px',
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            color: 'var(--terminal-accent-primary, #ff4e42)',
            fontSize: 'var(--terminal-font-size-xl, 1.25rem)',
          }}>
            👽 Alien Translator
          </h3>
          <AlienTranslatorInterface />
        </div>

        {/* Hexagon Grid */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--terminal-bg-secondary, #1a1a1a)',
          border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
          borderRadius: '8px',
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0',
            color: 'var(--terminal-accent-primary, #ff4e42)',
            fontSize: 'var(--terminal-font-size-xl, 1.25rem)',
          }}>
            🔷 Hexagon Grid
          </h3>
          <HexagonGrid
            rows={3}
            cols={4}
            hexagonSize={50}
            onHexagonClick={fn()}
            onHexagonHover={fn()}
          />
        </div>
      </div>

      {/* Theme Instructions */}
      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'var(--terminal-bg-panel, #1e1a18)',
        border: '1px solid var(--terminal-border-accent, rgba(248, 75, 64, 0.4))',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <h3 style={{ 
          margin: '0 0 15px 0',
          color: 'var(--terminal-accent-secondary, #f84b40)',
          fontSize: 'var(--terminal-font-size-lg, 1.125rem)',
        }}>
          🔄 How to Test Themes
        </h3>
        <p style={{ 
          margin: 0,
          color: 'var(--terminal-text-secondary, #c2b8b2)',
          fontSize: 'var(--terminal-font-size-base, 1rem)',
        }}>
          Use the Storybook toolbar at the top to switch between different themes. 
          Watch how all components, colors, and typography adapt to each theme!
        </p>
      </div>
    </div>
  );
};

export const ThemeTesting: Story = {
  render: () => <ThemeTestingComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive theme testing environment showing how all components adapt to different themes.',
      },
    },
  },
};

export const DesignTokenShowcase: Story = {
  render: () => (
    <div style={{ 
      padding: '40px',
      minHeight: '100vh',
      backgroundColor: 'var(--terminal-bg, #080C10)',
      color: 'var(--terminal-text-primary, #f3ede9)',
      fontFamily: 'var(--terminal-font-family, monospace)',
    }}>
      <h1 style={{ 
        color: 'var(--terminal-accent-primary, #ff4e42)',
        fontSize: 'var(--terminal-font-size-3xl, 1.875rem)',
        marginBottom: '30px',
      }}>
        Design Token Showcase
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
      }}>
        {/* Color Palette */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--terminal-bg-secondary, #1a1a1a)',
          border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
          borderRadius: '8px',
        }}>
          <h2 style={{ color: 'var(--terminal-accent-primary, #ff4e42)' }}>Color Palette</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              { name: 'Primary', token: '--terminal-accent-primary', default: '#ff4e42' },
              { name: 'Secondary', token: '--terminal-accent-secondary', default: '#f84b40' },
              { name: 'Success', token: '--terminal-success', default: '#10b981' },
              { name: 'Warning', token: '--terminal-warning', default: '#fbbf24' },
              { name: 'Error', token: '--terminal-error', default: '#ef4444' },
            ].map(color => (
              <div key={color.name} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: `var(${color.token}, ${color.default})`,
                  borderRadius: '4px',
                  border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
                }} />
                <div>
                  <div style={{ color: 'var(--terminal-text-primary, #f3ede9)' }}>{color.name}</div>
                  <div style={{ color: 'var(--terminal-text-muted, #6b7280)', fontSize: 'var(--terminal-font-size-sm, 0.875rem)' }}>
                    {color.token}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Scale */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--terminal-bg-secondary, #1a1a1a)',
          border: '1px solid var(--terminal-border, rgba(255, 78, 66, 0.3))',
          borderRadius: '8px',
        }}>
          <h2 style={{ color: 'var(--terminal-accent-primary, #ff4e42)' }}>Typography Scale</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              { size: '3xl', token: '--terminal-font-size-3xl', default: '1.875rem' },
              { size: '2xl', token: '--terminal-font-size-2xl', default: '1.5rem' },
              { size: 'xl', token: '--terminal-font-size-xl', default: '1.25rem' },
              { size: 'lg', token: '--terminal-font-size-lg', default: '1.125rem' },
              { size: 'base', token: '--terminal-font-size-base', default: '1rem' },
              { size: 'sm', token: '--terminal-font-size-sm', default: '0.875rem' },
              { size: 'xs', token: '--terminal-font-size-xs', default: '0.75rem' },
            ].map(font => (
              <div key={font.size}>
                <div style={{ 
                  color: 'var(--terminal-text-primary, #f3ede9)',
                  fontSize: `var(${font.token}, ${font.default})`,
                  fontFamily: 'var(--terminal-font-family, monospace)',
                }}>
                  {font.size.toUpperCase()} Text Sample
                </div>
                <div style={{ 
                  color: 'var(--terminal-text-muted, #6b7280)', 
                  fontSize: 'var(--terminal-font-size-sm, 0.875rem)',
                  marginTop: '5px',
                }}>
                  {font.token} = {font.default}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Detailed showcase of all design tokens and their values.',
      },
    },
  },
};
