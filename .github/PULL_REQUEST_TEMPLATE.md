# Pull Request Template

## 📋 Purpose

**Type of Change:**
- [ ] 🎨 Design tokens/theme
- [ ] 🧩 Component
- [ ] ♿ Accessibility
- [ ] ⚡ Performance
- [ ] 📄 Page
- [ ] 🐛 Bug fix
- [ ] ✨ Feature
- [ ] 📚 Documentation
- [ ] 🧪 Test

**Description:**
<!-- Provide a clear and concise description of what this PR accomplishes -->

**Related Issues:**
<!-- Link to any related issues or tickets -->
- Closes #[issue-number]
- Addresses #[issue-number]

## 🖼️ Screenshots/GIFs

<!-- Add screenshots or GIFs showing the changes. For accessibility improvements, include before/after screenshots if applicable -->

### Before
<!-- Screenshot of the current state -->

### After
<!-- Screenshot of the new state -->

## ♿ Accessibility Checks

<!-- Complete the accessibility checklist -->

### WCAG 2.2 AA Compliance
- [ ] **Keyboard Navigation**: All interactive elements are keyboard accessible
- [ ] **Screen Reader**: Tested with screen reader (NVDA/VoiceOver)
- [ ] **Color Contrast**: Meets 4.5:1 ratio for normal text, 3:1 for large text
- [ ] **Focus Indicators**: Visible focus indicators on all interactive elements
- [ ] **ARIA Labels**: All interactive elements have appropriate ARIA labels
- [ ] **Semantic HTML**: Proper use of semantic HTML elements
- [ ] **Form Labels**: All form fields have associated labels
- [ ] **Error Messages**: Error messages are clearly associated with form fields
- [ ] **Skip Links**: Skip links are available for main content areas
- [ ] **Reduced Motion**: Respects `prefers-reduced-motion` user preference

### Testing Completed
- [ ] **Manual Testing**: Tested with keyboard only navigation
- [ ] **Screen Reader Testing**: Tested with NVDA (Windows) or VoiceOver (macOS)
- [ ] **Color Contrast**: Verified with color contrast analyzer
- [ ] **Mobile Testing**: Tested on mobile devices with touch navigation
- [ ] **Browser Testing**: Tested across Chrome, Firefox, Safari, Edge

## ⚡ Performance Considerations

<!-- Document any performance implications -->

### Bundle Impact
- [ ] **Bundle Size**: No significant increase in bundle size
- [ ] **Code Splitting**: Lazy loading implemented where appropriate
- [ ] **Tree Shaking**: Unused code is properly eliminated
- [ ] **Image Optimization**: Images are optimized and use appropriate formats

### Runtime Performance
- [ ] **Rendering**: No unnecessary re-renders introduced
- [ ] **Memory Usage**: No memory leaks or excessive memory usage
- [ ] **API Calls**: Efficient API usage with proper caching
- [ ] **Animations**: Smooth animations with proper performance considerations

### Performance Testing
- [ ] **Lighthouse**: Lighthouse performance score maintained or improved
- [ ] **Core Web Vitals**: LCP, FID, CLS metrics within acceptable ranges
- [ ] **Load Testing**: Tested with slow network conditions
- [ ] **Memory Profiling**: No memory leaks detected

## 🔗 Linked Tasks

<!-- Reference tasks from implementation plan or backlog -->

**Implementation Plan Tasks:**
- [ ] Task #[task-number] from `docs/ui/IMPLEMENTATION_PLAN.md`

**Backlog Tasks:**
- [ ] Task #[task-number] from `docs/ui/BACKLOG.md`

**Related Documentation:**
- [ ] Updated `docs/ui/STATUS_LOG.md`
- [ ] Updated component documentation
- [ ] Updated design system documentation

## 🧪 Testing Done

<!-- Document the testing that was completed -->

### Unit Tests
- [ ] **Component Tests**: Unit tests written for new/modified components
- [ ] **Utility Tests**: Unit tests for utility functions
- [ ] **Hook Tests**: Unit tests for custom hooks
- [ ] **Test Coverage**: Maintained or improved test coverage

### Integration Tests
- [ ] **Component Integration**: Components work together correctly
- [ ] **API Integration**: API calls work as expected
- [ ] **State Management**: State changes work correctly
- [ ] **Routing**: Navigation works correctly

### Manual Testing
- [ ] **User Flows**: Tested complete user journeys
- [ ] **Edge Cases**: Tested error scenarios and edge cases
- [ ] **Cross-browser**: Tested in multiple browsers
- [ ] **Responsive Design**: Tested on different screen sizes
- [ ] **Accessibility**: Manual accessibility testing completed

### E2E Tests (if applicable)
- [ ] **Critical Paths**: E2E tests for critical user flows
- [ ] **Regression Testing**: Ensured no regressions in existing functionality
- [ ] **Visual Regression**: Visual regression tests pass

## 📚 Documentation Updated

<!-- Document any documentation changes -->

### Code Documentation
- [ ] **Component Props**: JSDoc comments for component props
- [ ] **Function Documentation**: JSDoc comments for functions
- [ ] **README Updates**: Updated README if needed
- [ ] **Code Comments**: Added inline comments for complex logic

### User Documentation
- [ ] **User Guide**: Updated user documentation if needed
- [ ] **API Documentation**: Updated API documentation if needed
- [ ] **Release Notes**: Added to release notes if needed

### Developer Documentation
- [ ] **Architecture Docs**: Updated architecture documentation
- [ ] **Setup Instructions**: Updated setup instructions if needed
- [ ] **Contributing Guidelines**: Updated contributing guidelines if needed

## 🔍 Code Review Checklist

<!-- Self-review checklist before requesting review -->

### Code Quality
- [ ] **ESLint**: All ESLint rules pass
- [ ] **Prettier**: Code is properly formatted
- [ ] **TypeScript**: No TypeScript errors (if applicable)
- [ ] **Naming**: Variables and functions have clear, descriptive names
- [ ] **Comments**: Complex logic is properly commented

### Best Practices
- [ ] **DRY Principle**: No code duplication
- [ ] **Single Responsibility**: Each function/component has a single responsibility
- [ ] **Error Handling**: Proper error handling implemented
- [ ] **Security**: No security vulnerabilities introduced
- [ ] **Performance**: No performance anti-patterns

### React Best Practices
- [ ] **Hooks**: Proper use of React hooks
- [ ] **State Management**: Appropriate state management approach
- [ ] **Props**: Props are properly typed and validated
- [ ] **Refs**: Proper use of refs where needed
- [ ] **Context**: Proper use of React Context if applicable

### Styling
- [ ] **Design Tokens**: Uses design tokens instead of hardcoded values
- [ ] **Responsive Design**: Responsive design implemented
- [ ] **Consistency**: Consistent with existing design patterns
- [ ] **Accessibility**: Styling supports accessibility requirements

## 🚀 Deployment Considerations

<!-- Document any deployment considerations -->

### Environment
- [ ] **Development**: Tested in development environment
- [ ] **Staging**: Tested in staging environment (if applicable)
- [ ] **Production**: Ready for production deployment

### Dependencies
- [ ] **New Dependencies**: Any new dependencies are necessary and minimal
- [ ] **Dependency Updates**: Existing dependencies updated safely
- [ ] **Security**: No security vulnerabilities in dependencies

### Configuration
- [ ] **Environment Variables**: Environment variables properly configured
- [ ] **Build Process**: Build process works correctly
- [ ] **Deployment Scripts**: Deployment scripts updated if needed

## 📝 Additional Notes

<!-- Any additional information that reviewers should know -->

### Breaking Changes
<!-- Document any breaking changes -->
- [ ] No breaking changes
- [ ] Breaking changes documented in migration guide

### Migration Guide
<!-- If there are breaking changes, provide migration steps -->
```jsx
// Example migration code
// Old way
<OldComponent />

// New way
<NewComponent />
```

### Future Considerations
<!-- Document any future work or considerations -->
- Future improvements or follow-up tasks
- Technical debt introduced or resolved
- Performance monitoring needed

## ✅ Final Checklist

Before submitting this PR, please ensure:

- [ ] All checkboxes above are completed
- [ ] Code follows project conventions
- [ ] Tests are passing
- [ ] Documentation is updated
- [ ] Accessibility requirements are met
- [ ] Performance impact is acceptable
- [ ] Security considerations are addressed
- [ ] Deployment is ready

---

**Reviewer Notes:**
<!-- Space for reviewers to add notes -->

**Approval:**
- [ ] **Code Review**: Approved by code reviewer
- [ ] **Design Review**: Approved by design reviewer (if applicable)
- [ ] **Accessibility Review**: Approved by accessibility reviewer (if applicable)
- [ ] **Performance Review**: Approved by performance reviewer (if applicable)
- [ ] **Final Approval**: Ready for merge

---

*PR Template v1.0 - Last updated: 2024-12-19*
