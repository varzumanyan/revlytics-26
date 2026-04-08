#!/bin/bash

# Add all accessibility changes
git add -A

# Commit with descriptive message
git commit -m "feat: implement WCAG 2.1 Level AA accessibility compliance

- Add semantic HTML5 landmarks (header, main, nav, footer) throughout
- Implement skip navigation link for keyboard users
- Add comprehensive ARIA labels and roles to all interactive elements
- Make all charts and data visualizations screen reader accessible
- Add keyboard navigation support to sortable tables
- Enhance focus indicators to meet 3:1 contrast ratio requirements
- Fix color contrast ratios in CSS variables
- Add aria-live regions for dynamic content updates
- Remove auto-opening dialog behavior
- Update viewport meta tag to allow user scaling
- Add descriptive ARIA labels to all social media links
- Implement proper heading hierarchy across all pages
- Make admin password form fully accessible
- Add role attributes to all cards and data regions"

# Push to the branch
git push origin HEAD

echo "Accessibility changes committed and pushed successfully!"
