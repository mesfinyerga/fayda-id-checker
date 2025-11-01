# Accessibility Checklist

## Overview

This checklist ensures the Fayda ID Checker application meets WCAG 2.2 AA standards. Use this checklist during development, testing, and code reviews to maintain accessibility compliance.

## WCAG 2.2 AA Compliance Checklist

### 1. Perceivable

#### 1.1 Text Alternatives
- [ ] **1.1.1 Non-text Content**: All images have appropriate alt text
- [ ] **1.1.1**: Decorative images have empty alt="" or are marked as decorative
- [ ] **1.1.1**: Complex images (charts, graphs) have descriptive alt text
- [ ] **1.1.1**: Form images (icons) have descriptive alt text

**Implementation Examples:**
```jsx
// ✅ Good - Descriptive alt text
<img src="user-avatar.jpg" alt="Profile photo of John Doe" />

// ✅ Good - Decorative image
<img src="decorative-icon.svg" alt="" />

// ✅ Good - Icon with context
<IconButton aria-label="Delete user account">
  <DeleteIcon />
</IconButton>
```

#### 1.2 Time-based Media
- [ ] **1.2.1 Audio-only and Video-only**: Not applicable (no media content)
- [ ] **1.2.2 Captions**: Not applicable (no video content)
- [ ] **1.2.3 Audio Description**: Not applicable (no video content)

#### 1.3 Adaptable
- [ ] **1.3.1 Info and Relationships**: Information structure is preserved
- [ ] **1.3.1**: Headings are used properly (h1, h2, h3, etc.)
- [ ] **1.3.1**: Lists are marked up as `<ul>`, `<ol>`, `<li>`
- [ ] **1.3.1**: Tables have proper headers and scope attributes
- [ ] **1.3.2 Meaningful Sequence**: Content order is logical
- [ ] **1.3.3 Sensory Characteristics**: Instructions don't rely on shape, size, or position alone

**Implementation Examples:**
```jsx
// ✅ Good - Proper heading structure
<Typography variant="h1">Page Title</Typography>
<Typography variant="h2">Section Title</Typography>
<Typography variant="h3">Subsection Title</Typography>

// ✅ Good - Table with proper headers
<TableHead>
  <TableRow>
    <TableCell scope="col">Name</TableCell>
    <TableCell scope="col">Email</TableCell>
  </TableRow>
</TableHead>

// ✅ Good - List markup
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>
```

#### 1.4 Distinguishable
- [ ] **1.4.1 Use of Color**: Color is not the only way to convey information
- [ ] **1.4.3 Contrast (Minimum)**: Text has sufficient contrast ratio
- [ ] **1.4.3**: Normal text: 4.5:1 contrast ratio
- [ ] **1.4.3**: Large text: 3:1 contrast ratio
- [ ] **1.4.4 Resize Text**: Text can be resized up to 200% without loss of functionality
- [ ] **1.4.5 Images of Text**: Text is not presented as images
- [ ] **1.4.10 Reflow**: Content can be presented without horizontal scrolling at 320px width
- [ ] **1.4.11 Non-text Contrast**: UI elements have sufficient contrast
- [ ] **1.4.12 Text Spacing**: Text spacing can be adjusted
- [ ] **1.4.13 Content on Hover or Focus**: Additional content is dismissible

**Color Contrast Table:**
| Element | Background | Text | Contrast Ratio | Status |
|---------|------------|------|----------------|---------|
| Primary Button | #1976d2 | #ffffff | 4.5:1 | ✅ Pass |
| Secondary Text | #ffffff | #757575 | 4.5:1 | ✅ Pass |
| Error Text | #ffffff | #d32f2f | 4.5:1 | ✅ Pass |
| Link Text | #ffffff | #1976d2 | 4.5:1 | ✅ Pass |

### 2. Operable

#### 2.1 Keyboard Accessible
- [ ] **2.1.1 Keyboard**: All functionality is available from keyboard
- [ ] **2.1.1**: All interactive elements are focusable
- [ ] **2.1.1**: Custom controls have keyboard support
- [ ] **2.1.2 No Keyboard Trap**: Focus can be moved away from any component
- [ ] **2.1.4 Single Character Key Shortcuts**: Not applicable (no single-key shortcuts)

**Implementation Examples:**
```jsx
// ✅ Good - Keyboard accessible button
<Button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</Button>

// ✅ Good - Focusable custom component
<div
  tabIndex={0}
  role="button"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom button
</div>
```

#### 2.2 Enough Time
- [ ] **2.2.1 Timing Adjustable**: Time limits can be adjusted or turned off
- [ ] **2.2.2 Pause, Stop, Hide**: Moving content can be paused, stopped, or hidden
- [ ] **2.2.6 Timeouts**: Users are warned before session timeout

#### 2.3 Seizures and Physical Reactions
- [ ] **2.3.1 Three Flashes**: Content does not flash more than 3 times per second
- [ ] **2.3.2 Three Flashes**: Not applicable (no flashing content)

#### 2.4 Navigable
- [ ] **2.4.1 Bypass Blocks**: Skip links are provided for main content
- [ ] **2.4.2 Page Titled**: Pages have descriptive titles
- [ ] **2.4.3 Focus Order**: Tab order is logical and intuitive
- [ ] **2.4.4 Link Purpose**: Link purpose is clear from context
- [ ] **2.4.5 Multiple Ways**: Multiple ways to navigate (navigation, search, sitemap)
- [ ] **2.4.6 Headings and Labels**: Headings and labels are descriptive
- [ ] **2.4.7 Focus Visible**: Focus indicator is visible
- [ ] **2.4.8 Location**: User's location within the site is clear
- [ ] **2.4.9 Link Purpose (Link Only)**: Link purpose is clear from link text alone
- [ ] **2.4.10 Section Headings**: Section headings are used to organize content

**Implementation Examples:**
```jsx
// ✅ Good - Skip link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// ✅ Good - Descriptive page title
<Helmet>
  <title>User Dashboard - Fayda ID Checker</title>
</Helmet>

// ✅ Good - Clear link purpose
<a href="/profile">View Profile</a> // Instead of "Click here"

// ✅ Good - Focus indicator
<Button
  sx={{
    '&:focus': {
      outline: '2px solid #1976d2',
      outlineOffset: '2px'
    }
  }}
>
  Button
</Button>
```

#### 2.5 Input Modalities
- [ ] **2.5.1 Pointer Gestures**: Single pointer gestures are supported
- [ ] **2.5.2 Pointer Cancellation**: Pointer actions can be cancelled
- [ ] **2.5.3 Label in Name**: Labels match accessible names
- [ ] **2.5.4 Motion Actuation**: Functionality is not dependent on device motion
- [ ] **2.5.5 Target Size**: Touch targets are at least 44x44px
- [ ] **2.5.6 Input Mechanisms**: Input mechanisms are not restricted

**Implementation Examples:**
```jsx
// ✅ Good - Adequate touch target
<IconButton
  sx={{
    minWidth: 44,
    minHeight: 44,
    padding: 1
  }}
>
  <DeleteIcon />
</IconButton>

// ✅ Good - Label matches accessible name
<TextField
  label="Email Address"
  aria-label="Email Address"
  id="email"
/>
```

### 3. Understandable

#### 3.1 Readable
- [ ] **3.1.1 Language of Page**: Page language is specified
- [ ] **3.1.2 Language of Parts**: Language changes are marked
- [ ] **3.1.3 Unusual Words**: Unusual words are explained
- [ ] **3.1.4 Abbreviations**: Abbreviations are expanded
- [ ] **3.1.5 Reading Level**: Reading level is appropriate
- [ ] **3.1.6 Pronunciation**: Pronunciation is provided when needed

**Implementation Examples:**
```jsx
// ✅ Good - Language specification
<html lang="en">
  <body>
    <div lang="am">አማርኛ ጽሑፍ</div>
  </body>
</html>

// ✅ Good - Abbreviation expansion
<abbr title="Know Your Customer">KYC</abbr>
```

#### 3.2 Predictable
- [ ] **3.2.1 On Focus**: Focus does not change context
- [ ] **3.2.2 On Input**: Input does not change context automatically
- [ ] **3.2.3 Consistent Navigation**: Navigation is consistent
- [ ] **3.2.4 Consistent Identification**: Components are identified consistently
- [ ] **3.2.5 Change on Request**: Context changes only on user request

#### 3.3 Input Assistance
- [ ] **3.3.1 Error Identification**: Errors are clearly identified
- [ ] **3.3.2 Labels or Instructions**: Labels and instructions are provided
- [ ] **3.3.3 Error Suggestion**: Error suggestions are provided
- [ ] **3.3.4 Error Prevention**: Critical errors are prevented
- [ ] **3.3.5 Help**: Help is available
- [ ] **3.3.6 Error Prevention**: Reversible actions are provided
- [ ] **3.3.7 Authentication**: Authentication is accessible
- [ ] **3.3.8 Redundant Entry**: Information is not re-entered unnecessarily

**Implementation Examples:**
```jsx
// ✅ Good - Error identification
<TextField
  error={hasError}
  helperText={errorMessage}
  aria-describedby="email-error"
/>

// ✅ Good - Error suggestion
{hasError && (
  <Typography id="email-error" color="error" variant="caption">
    Please enter a valid email address (e.g., user@example.com)
  </Typography>
)}

// ✅ Good - Help text
<TextField
  label="ID Number"
  helperText="Enter your 9-digit Fayda ID number"
  aria-describedby="id-help"
/>
```

### 4. Robust

#### 4.1 Compatible
- [ ] **4.1.1 Parsing**: Content can be parsed by assistive technology
- [ ] **4.1.2 Name, Role, Value**: Custom controls have accessible names and roles
- [ ] **4.1.3 Status Messages**: Status messages are announced to screen readers

**Implementation Examples:**
```jsx
// ✅ Good - Proper ARIA attributes
<button
  aria-label="Delete user account"
  aria-describedby="delete-description"
  role="button"
>
  Delete
</button>

// ✅ Good - Status message announcement
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>
```

## Quick Tests

### Keyboard-Only Navigation
1. **Tab Navigation**: Can navigate through all interactive elements using Tab
2. **Enter/Space**: Can activate buttons and links using Enter or Space
3. **Escape**: Can close modals and dialogs using Escape
4. **Arrow Keys**: Can navigate select options and tabs using arrow keys
5. **No Keyboard Traps**: Can move focus away from any component

### Screen Reader Testing
1. **Page Title**: Screen reader announces appropriate page title
2. **Heading Structure**: Headings are announced in logical order
3. **Form Labels**: Form fields are properly labeled
4. **Error Messages**: Error messages are announced
5. **Status Updates**: Status changes are announced

### Color Contrast Testing
1. **Normal Text**: 4.5:1 contrast ratio minimum
2. **Large Text**: 3:1 contrast ratio minimum
3. **UI Elements**: Sufficient contrast for interactive elements
4. **Focus Indicators**: Focus indicators are visible

### Form Accessibility
1. **Labels**: All form fields have associated labels
2. **Error Association**: Error messages are associated with fields
3. **Required Fields**: Required fields are clearly marked
4. **Validation**: Real-time validation provides clear feedback

## Testing Tools

### Automated Testing
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Accessibility audit
- **ESLint-plugin-jsx-a11y**: Code-level accessibility rules

### Manual Testing
- **NVDA** (Windows): Free screen reader
- **VoiceOver** (macOS): Built-in screen reader
- **Chrome DevTools**: Accessibility inspection
- **Color Contrast Analyzer**: Contrast ratio testing

## Implementation Checklist

### Components to Update
- [ ] **Navbar**: Add skip link, improve focus management
- [ ] **LoginForm**: Add proper error association, improve labels
- [ ] **AdminDashboard**: Add table headers, improve keyboard navigation
- [ ] **PaymentHistory**: Add proper table structure
- [ ] **IDCheckForm**: Add proper form labels and error handling
- [ ] **UserProfile**: Add proper form accessibility

### Global Improvements
- [ ] **Theme**: Ensure sufficient color contrast throughout
- [ ] **Focus Management**: Implement proper focus indicators
- [ ] **Error Boundaries**: Add accessible error handling
- [ ] **Loading States**: Add accessible loading indicators
- [ ] **Notifications**: Implement accessible toast notifications

## Resources

### Documentation
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [MUI Accessibility](https://mui.com/material-ui/getting-started/accessibility/)
- [React Accessibility](https://react.dev/learn/accessibility)

### Tools
- [axe DevTools](https://www.deque.com/axe/browser-extensions/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

---

*Accessibility Checklist v1.0 - Last updated: 2024-12-19*
