# Design Token System

## Overview

The Fayda ID Checker application uses a comprehensive design token system that provides consistent design values across the entire application. This system integrates with both Material-UI (MUI) and Tailwind CSS to ensure design consistency.

## Architecture

```
src/theme/
├── designTokens.js    # Core design token definitions
├── index.js          # MUI theme configuration
└── README.md         # This documentation

src/utils/
└── themeUtils.js     # Utility functions for accessing tokens
```

## Design Tokens

### Colors

The color system includes:

- **Primary Colors**: Blue-based primary palette with 10 shades (50-900)
- **Neutral Colors**: Gray-based neutral palette with 10 shades (50-900)
- **Semantic Colors**: Success, warning, error, and info colors
- **Background Colors**: Default and paper backgrounds
- **Text Colors**: Primary, secondary, and disabled text colors

### Typography

Typography system includes:

- **Font Families**: Primary (Roboto) and secondary (Inter) font stacks
- **Typography Variants**: h1-h6, body1, body2, caption, button
- **Responsive Typography**: Font sizes scale appropriately

### Spacing

Two spacing systems:

- **MUI Spacing**: 8px base unit (0-10 factors)
- **Tailwind Spacing**: 4px base unit (1-20 factors)

### Border Radius

Standardized border radius values:

- `none`: 0px
- `sm`: 4px
- `md`: 8px
- `lg`: 12px
- `xl`: 16px
- `full`: 9999px

### Shadows

Comprehensive shadow system:

- **MUI Shadows**: 24 elevation levels (0-23)
- **Custom Shadows**: Card, button, modal, dropdown shadows

### Transitions

Standardized transition system:

- **Durations**: shortest, shorter, short, standard, complex, enteringScreen, leavingScreen
- **Easing**: easeInOut, easeOut, easeIn, sharp

## Usage

### In MUI Components

```jsx
import { Box, Button } from '@mui/material';

// Using theme colors
<Box sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
  Content
</Box>

// Using theme spacing
<Box sx={{ padding: 3, margin: 2 }}>
  Content
</Box>

// Using theme typography
<Typography variant="h4" sx={{ color: 'text.primary' }}>
  Heading
</Typography>
```

### In Tailwind Components

```jsx
// Using design token colors
<div className="bg-primary-main text-white">
  Content
</div>

// Using design token spacing
<div className="p-4 m-2">
  Content
</div>

// Using custom shadows
<div className="shadow-card">
  Content
</div>
```

### Using Theme Utilities

```jsx
import { getColor, getSpacing, sxPatterns } from '../utils/themeUtils';

// Get specific color values
const primaryColor = getColor('primary.main');
const neutralColor = getColor('neutral.500');

// Get spacing values
const spacing = getSpacing(3); // 24px (MUI)
const tailwindSpacing = getSpacing(6, 'tailwind'); // 24px (Tailwind)

// Use predefined patterns
<Card sx={sxPatterns.card}>
  <CardContent>Content</CardContent>
</Card>

<Button sx={sxPatterns.button}>
  Click me
</Button>
```

## MUI Theme Integration

The MUI theme is configured in `src/theme/index.js` and includes:

- **Palette**: All color tokens mapped to MUI palette
- **Typography**: Typography variants with design token values
- **Spacing**: Custom spacing function using design tokens
- **Shadows**: MUI shadows array with design token values
- **Component Overrides**: Custom styling for MUI components

## Tailwind Integration

Tailwind CSS is configured in `tailwind.config.js` with:

- **Colors**: Design token colors available as Tailwind classes
- **Spacing**: Custom spacing values matching design tokens
- **Border Radius**: Custom border radius values
- **Shadows**: Custom shadow values
- **Typography**: Custom font families and sizes

## Best Practices

### 1. Use Design Tokens Consistently

```jsx
// ✅ Good - Use theme colors
sx={{ backgroundColor: 'primary.main' }}

// ❌ Bad - Hardcode colors
sx={{ backgroundColor: '#1976d2' }}
```

### 2. Use Theme Spacing

```jsx
// ✅ Good - Use theme spacing
sx={{ padding: 3, margin: 2 }}

// ❌ Bad - Hardcode spacing
sx={{ padding: '24px', margin: '16px' }}
```

### 3. Use Typography Variants

```jsx
// ✅ Good - Use typography variants
<Typography variant="h4">Heading</Typography>

// ❌ Bad - Custom typography
<Typography sx={{ fontSize: '24px', fontWeight: 600 }}>Heading</Typography>
```

### 4. Use Predefined Patterns

```jsx
// ✅ Good - Use sxPatterns
<Card sx={sxPatterns.card}>
  <CardContent>Content</CardContent>
</Card>

// ❌ Bad - Custom styling
<Card sx={{ 
  borderRadius: '12px', 
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' 
}}>
  <CardContent>Content</CardContent>
</Card>
```

## Testing

To test the design token system:

1. Navigate to `/design-test` in the application
2. Verify all components render with correct design tokens
3. Check color contrast ratios meet accessibility standards
4. Test responsive behavior
5. Verify MUI and Tailwind integration works correctly

## Accessibility

The design token system ensures:

- **Color Contrast**: All color combinations meet WCAG 2.2 AA standards
- **Focus Indicators**: Consistent focus styling across components
- **Typography**: Readable font sizes and line heights
- **Spacing**: Adequate touch targets and spacing

## Future Enhancements

- Dark mode support
- Theme switching capability
- Additional semantic colors
- Extended typography scale
- Animation tokens
- Icon system integration

## Resources

- [Material-UI Theme Documentation](https://mui.com/material-ui/customization/theme-components/)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
- [Design Token Specification](https://design-tokens.github.io/community-group/format/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
