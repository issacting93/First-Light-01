# @firstlight/reusable-components

A library of reusable UI components and design tokens for First Light projects.

## 🏗️ Structure

```
reusable-components/
├── src/
│   ├── ui/           # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── Terminal.tsx
│   │   └── useAutoScroll.ts
│   ├── tokens/       # Design tokens and CSS
│   │   ├── index.ts
│   │   ├── styles.css
│   │   └── tailwind.preset.ts
│   └── index.ts      # Main exports
├── .storybook/       # Storybook configuration
├── dist/             # Built output
└── package.json
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Start Storybook
pnpm storybook
```

### Usage

```typescript
// Import components
import { Card, Terminal, useAutoScroll } from '@firstlight/reusable-components';

// Import design tokens
import '@firstlight/reusable-components/tokens/styles.css';
```

## 📦 Available Components

### UI Components

- **Card** - Flexible card component with variants
- **Terminal** - Terminal-style component with auto-scroll
- **useAutoScroll** - Hook for automatic scrolling

### Design Tokens

- **CSS Variables** - Consistent theming
- **Tailwind Preset** - Brand colors and typography
- **Animation Keyframes** - Reusable animations

## 🧪 Development

```bash
# Watch mode for development
pnpm dev

# Run tests
pnpm test

# Build specific packages
pnpm build:ui
pnpm build:tokens
pnpm build:all
```

## 📚 Storybook

Storybook is configured to showcase all components:

```bash
pnpm storybook
```

Access at: http://localhost:6006

## 🔧 Build Configuration

The library uses **tsup** for building:

- **Main build**: `tsup.config.ts`
- **UI components**: `tsup.ui.config.ts`  
- **Design tokens**: `tsup.tokens.config.ts`

## 📝 Contributing

1. Add new components to `src/ui/`
2. Add new tokens to `src/tokens/`
3. Update exports in `src/index.ts`
4. Add Storybook stories
5. Test with `pnpm test`
6. Build with `pnpm build`

## 🎯 Future Plans

- [ ] Add more UI components
- [ ] Expand design token system
- [ ] Add component playground
- [ ] Performance optimizations
- [ ] Accessibility improvements
