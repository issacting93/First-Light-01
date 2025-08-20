# BluerayInterface Component

A React component that provides a film/Blu-ray selector interface with expandable cards, scroll-based animations, and responsive design. This component was refactored from a Svelte component to provide a modern, reusable React interface.

## Features

- **Expandable Film Cards**: Hover to expand cards, click to select and expand further
- **Responsive Design**: Adapts to different screen sizes with mobile-first approach
- **Scroll-Based Animations**: CSS animations that respond to scroll position
- **Template System**: Customizable content templates for each film
- **Video Trailer Support**: Optional video overlay for film trailers
- **TypeScript Support**: Fully typed with TypeScript interfaces
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Installation

The component is located in your `@components/` directory and includes:

- `BluerayInterface.tsx` - Main component
- `BluerayInterface.css` - Styles
- `BluerayDemo.tsx` - Usage example

## Basic Usage

```tsx
import React from 'react';
import BluerayInterface from './BluerayInterface';
import './BluerayInterface.css';

const MyComponent = () => {
  const films = [
    {
      id: 'film1',
      title: 'Film Title',
      imgUrl: 'path/to/image.jpg',
      trailer: 'path/to/trailer.mp4' // optional
    }
  ];

  const handleFilmSelect = (filmId: string) => {
    console.log('Selected film:', filmId);
  };

  const handleFilmClose = () => {
    console.log('Film closed');
  };

  return (
    <BluerayInterface
      films={films}
      onFilmSelect={handleFilmSelect}
      onFilmClose={handleFilmClose}
    />
  );
};
```

## Props

### BluerayInterfaceProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `films` | `Film[]` | Yes | Array of film objects |
| `onFilmSelect` | `(filmId: string) => void` | No | Callback when a film is selected |
| `onFilmClose` | `() => void` | No | Callback when a film is closed |

### Film Object Structure

```typescript
interface Film {
  id: string;           // Unique identifier
  title: string;        // Film title
  imgUrl: string;       // Background image URL
  trailer?: string;     // Optional video trailer URL
}
```

## Component States

The component manages three main states for each film:

1. **Default**: Initial state with hover effects
2. **Selected/Expanded**: Film is selected and expanded (scroll-open)
3. **Details Open**: Film is fully expanded with details (details-open)

## Template System

The component includes a template system that allows you to customize content for each film. Templates are mapped by film ID:

```typescript
const templateMap: Record<string, React.FC<TemplateProps>> = {
  'item01': Template01,
  'item02': Template02,
  // Add more templates as needed
};
```

To add custom templates:

1. Create a new template component
2. Add it to the `templateMap` in `BluerayInterface.tsx`
3. The component will automatically use the appropriate template

## Styling

The component uses CSS custom properties for dynamic positioning:

```css
:root {
  --button-top-offset: 15vh;
  --button-right-offset: calc(50% + 375px);
  --max-width: 1200px;
  --White: #FFF;
}
```

### Key CSS Classes

- `.blueray` - Individual film card
- `.scroll-open` - Expanded state
- `.details-open` - Fully expanded state
- `.fade-in` - Animation class for content
- `.text-title` - Film title overlay

## Responsive Breakpoints

- **Desktop**: > 1200px - Full layout with side positioning
- **Tablet**: 950px - 1200px - Adjusted animations
- **Mobile**: < 950px - Vertical layout with mobile-specific animations

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS Custom Properties (CSS Variables)
- CSS Animations and Transitions

## Performance Considerations

- Uses `useCallback` for event handlers to prevent unnecessary re-renders
- Implements proper cleanup for event listeners
- CSS animations are hardware-accelerated where possible

## Accessibility Features

- Proper focus management
- Keyboard navigation support
- ARIA labels for interactive elements
- Screen reader friendly structure

## Customization

### Adding New Templates

```typescript
const CustomTemplate: React.FC<TemplateProps> = ({ filmId, filmTitle }) => (
  <div className="custom-template">
    <h3>{filmTitle}</h3>
    <p>Custom content for {filmId}</p>
  </div>
);

// Add to templateMap
const templateMap: Record<string, React.FC<TemplateProps>> = {
  'custom': CustomTemplate,
  // ... existing templates
};
```

### Modifying Animations

Edit the CSS keyframes in `BluerayInterface.css`:

```css
@keyframes grow-progress {
  0% { /* Initial state */ }
  100% { /* Final state */ }
}
```

### Custom Styling

Override CSS classes or modify the base styles in `BluerayInterface.css` to match your design system.

## Troubleshooting

### Common Issues

1. **Images not loading**: Ensure `imgUrl` paths are correct and accessible
2. **Animations not working**: Check that CSS is properly imported
3. **Responsive issues**: Verify viewport meta tag is set correctly

### Debug Mode

Add console logs to track component state:

```typescript
const handleFilmSelect = (filmId: string) => {
  console.log('Film selected:', filmId);
  // Your logic here
};
```

## Examples

See `BluerayDemo.tsx` for a complete working example with sample data and styling.

## Contributing

When modifying the component:

1. Maintain TypeScript types
2. Test responsive behavior
3. Ensure accessibility standards
4. Update this documentation
5. Test with different film data structures
