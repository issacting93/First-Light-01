# Encounter Monorepo

A pnpm workspaces monorepo for the Encounter React application with reusable UI components and design tokens.

## 🏗️ Structure

```
first-light-monorepo/
├── apps/
│   └── first-light/          # Main React application
├── packages/
│   ├── ui/                   # Reusable UI components
│   └── tokens/               # Design tokens and Tailwind preset
├── package.json              # Root package.json with workspace scripts
├── pnpm-workspace.yaml       # pnpm workspace configuration
└── tsconfig.base.json        # Base TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies across all packages
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build:all

# Build specific packages
pnpm build:ui
pnpm build:tokens
```

## 📦 Packages

### `@firstlight/tokens`

Design tokens package containing:
- Tailwind CSS preset with brand colors and typography
- CSS variables for consistent theming
- Animation keyframes and utilities

**Usage:**
```typescript
// In tailwind.config.js
export default {
  presets: [require('@firstlight/tokens/tailwind.preset')],
  // ... rest of config
}

// In main.tsx
import '@firstlight/tokens/styles.css'
```

### `@firstlight/ui`

Reusable UI components package containing:
- `Card` - Flexible card component with variants
- `Terminal` - Terminal-style component with auto-scroll
- `HexGrid` - Hexagonal grid layout component
- `useAutoScroll` - Hook for automatic scrolling

**Usage:**
```typescript
import { Card, Terminal, HexGrid, useAutoScroll } from '@firstlight/ui'

// Card component
<Card variant="terminal" padding="lg">
  <h2>Terminal Card</h2>
</Card>

// Terminal component
<Terminal 
  messages={['System initialized', 'Ready for input']}
  autoScroll={true}
/>

// HexGrid component
<HexGrid 
  items={hexItems}
  onItemClick={(id) => console.log(id)}
/>
```

## 🎨 Design System

The design system is built around a terminal/cyberpunk aesthetic with:

- **Colors**: Primary accent color `#ff4e42` with dark backgrounds
- **Typography**: Monospace font "TheGoodMonolith" for terminal feel
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and glow effects

### CSS Variables

All design tokens are exposed as CSS variables:

```css
:root {
  --terminal-bg: #080C10;
  --terminal-accent-primary: #ff4e42;
  --terminal-text-primary: #f3ede9;
  /* ... more variables */
}
```

## 🔧 Development

### Adding New Components

1. Create component in `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts`
3. Build UI package: `pnpm build:ui`
4. Import in app: `import { NewComponent } from '@firstlight/ui'`

### Adding New Tokens

1. Add to `packages/tokens/src/tailwind.preset.ts`
2. Add CSS variables to `packages/tokens/src/styles.css`
3. Build tokens package: `pnpm build:tokens`
4. Use in components with Tailwind classes

### Scripts

```bash
# Development
pnpm dev                    # Start app dev server
pnpm dev:ui                # Watch UI package changes
pnpm dev:tokens            # Watch tokens package changes

# Building
pnpm build:all            # Build all packages
pnpm build                # Build just the app
pnpm build:ui             # Build UI package
pnpm build:tokens         # Build tokens package

# Linting
pnpm lint                 # Lint all packages
pnpm lint:fix            # Fix linting issues

# Cleanup
pnpm clean               # Remove all node_modules and dist
```

## 🎯 Architecture Principles

1. **Separation of Concerns**: UI components are headless and accept data via props
2. **No Domain Logic**: UI package contains no business logic
3. **Design Token Driven**: All styling uses design tokens from the tokens package
4. **Type Safety**: Full TypeScript support across all packages
5. **Consistent API**: Components follow consistent prop patterns

## 🚨 Known Issues

- [x] Fixed: Three.js resource disposal in StrictMode
- [x] Fixed: Map state mutations with immutable updates
- [x] Fixed: Import resolution for workspace packages
- [x] Fixed: Tailwind v4 compatibility

## 📝 Contributing

1. Make changes in the appropriate package
2. Build the package: `pnpm build:ui` or `pnpm build:tokens`
3. Test changes in the app: `pnpm dev`
4. Commit with conventional commit format

## 📄 License

MIT License - see LICENSE file for details # First-Light-01
