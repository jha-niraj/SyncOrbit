# Implementation Plan

- [ ] 1. Update SidebarContext with mode switching capability
  - Update the SidebarContext interface to include mode, setMode, canSwitchMode, and setCanSwitchMode
  - Implement localStorage persistence for mode state
  - Add logic to determine canSwitchMode based on user role
  - _Requirements: 1.1, 1.4, 1.5, 11.1, 11.2, 11.3, 11.4_

- [ ] 1.1 Write property test for SidebarContext
  - **Property 4: Mode persistence**
  - **Validates: Requirements 1.4**

- [ ] 1.2 Write property test for collapsed state persistence
  - **Property 5: Collapsed state persistence**
  - **Validates: Requirements 8.5**

- [ ] 2. Create navigation configuration system
  - Create centralized navigation configuration with internal, external, and common items
  - Define NavItem interface with roles and modes arrays
  - Implement getNavigationItems function that returns role-filtered navigation
  - Add icons for all navigation items (Home, Team, Analytics, etc.)
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 4.1, 5.1, 5.2, 6.1, 7.1, 12.1, 13.1, 13.2_

- [ ] 2.1 Write property test for navigation item role filtering
  - **Property 2: Navigation item role filtering**
  - **Validates: Requirements 2.1, 2.5**

- [ ] 2.2 Write property test for navigation item mode filtering
  - **Property 3: Navigation item mode filtering**
  - **Validates: Requirements 2.2, 2.3**

- [ ] 2.3 Write property test for COMPANY_OWNER internal navigation
  - **Property 7: COMPANY_OWNER internal navigation**
  - **Validates: Requirements 3.1**

- [ ] 2.4 Write property test for COMPANY_OWNER external navigation
  - **Property 8: COMPANY_OWNER external navigation**
  - **Validates: Requirements 4.1**

- [ ] 2.5 Write property test for TEAM_MEMBER navigation restrictions
  - **Property 9: TEAM_MEMBER navigation restrictions**
  - **Validates: Requirements 6.2, 6.3**

- [ ] 2.6 Write property test for CLIENT navigation restrictions
  - **Property 10: CLIENT navigation restrictions**
  - **Validates: Requirements 7.2, 7.5**

- [ ] 3. Update NavMenu component with filtering logic
  - Update NavMenu to accept userRole prop
  - Implement role-based filtering of navigation items
  - Implement mode-based filtering of navigation items
  - Update rendering logic to use filtered items
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 3.1 Write unit tests for NavMenu filtering
  - Test role filtering works correctly
  - Test mode filtering works correctly
  - Test combined role and mode filtering
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 4. Create ModeSwitcher component
  - Create new ModeSwitcher component with toggle UI
  - Integrate with SidebarContext to read and update mode
  - Add visual indicators for current mode (internal/external)
  - Implement smooth transition animations
  - Only render when canSwitchMode is true
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ] 4.1 Write property test for mode switcher visibility
  - **Property 1: Mode switcher visibility**
  - **Validates: Requirements 1.1, 1.5**

- [ ] 4.2 Write unit tests for ModeSwitcher
  - Test component renders when canSwitchMode is true
  - Test component does not render when canSwitchMode is false
  - Test clicking toggle updates mode in context
  - Test visual indicator shows correct current mode
  - _Requirements: 1.1, 1.2, 1.5_

- [ ] 5. Update Sidebar component to integrate ModeSwitcher
  - Add ModeSwitcher to sidebar header
  - Position ModeSwitcher appropriately in layout
  - Ensure ModeSwitcher is hidden on mobile
  - Update sidebar to use user role from session
  - Set canSwitchMode based on user role (COMPANY_OWNER, TEAM_HEAD)
  - _Requirements: 1.1, 1.5, 3.1, 4.1, 5.1, 6.2, 7.2_

- [ ] 5.1 Write integration test for sidebar with mode switching
  - Test COMPANY_OWNER can see and use mode switcher
  - Test TEAM_HEAD can see and use mode switcher
  - Test TEAM_MEMBER cannot see mode switcher
  - Test CLIENT cannot see mode switcher
  - _Requirements: 1.1, 1.5, 6.2, 7.2_

- [ ] 6. Update NavItem components with enhanced styling
  - Update active state styling to use primary color
  - Add left border indicator for active items
  - Ensure icon sizing is consistent at 20x20 pixels
  - Add badge support for notification counts
  - Improve hover states and transitions
  - _Requirements: 9.1, 9.2, 9.3, 12.2, 12.3, 12.4, 12.5_

- [ ] 6.1 Write property test for active route highlighting
  - **Property 6: Active route highlighting**
  - **Validates: Requirements 9.1, 9.4**

- [ ] 6.2 Write property test for icon consistency
  - **Property 13: Icon consistency**
  - **Validates: Requirements 12.2, 12.3**

- [ ] 6.3 Write unit tests for NavItem styling
  - Test active state applies correct styling
  - Test left border indicator appears when active
  - Test icon dimensions are 20x20
  - Test badge renders when provided
  - _Requirements: 9.1, 9.2, 12.2_

- [ ] 7. Implement mobile responsive behavior
  - Ensure sidebar hides by default on mobile (<1024px)
  - Implement mobile menu button
  - Add backdrop overlay for mobile sidebar
  - Implement auto-close on navigation or backdrop click
  - Add smooth animations for mobile sidebar transitions
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 7.1 Write property test for mobile sidebar auto-close
  - **Property 11: Mobile sidebar auto-close**
  - **Validates: Requirements 10.4**

- [ ] 7.2 Write unit tests for mobile responsive behavior
  - Test sidebar hides on mobile viewport
  - Test mobile menu button appears
  - Test backdrop renders when sidebar is open
  - Test clicking backdrop closes sidebar
  - Test clicking nav item closes sidebar
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 8. Add route-specific navigation items
  - Implement Dashboard route for internal mode (/dashboard)
  - Implement Dashboard route for external mode (/client-dashboard)
  - Add Team route (/team) for internal mode
  - Add Companies route (/companies) for CLIENT role
  - Add Analytics routes for both modes
  - Add Calendar route (/calendar) for internal mode
  - Add Communications route (/communications) for internal mode
  - Add Invoices route (/invoices) for external mode
  - Add Reports route (/reports) for external mode
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 6.1, 7.1, 7.3_

- [ ] 8.1 Write integration tests for route navigation
  - Test navigation to internal routes works
  - Test navigation to external routes works
  - Test route guards prevent unauthorized access
  - _Requirements: 3.2, 4.2, 7.4_

- [ ] 9. Implement context state propagation
  - Ensure all components consuming context receive updates
  - Optimize re-renders with React.memo where appropriate
  - Add performance monitoring for state updates
  - Verify updates occur within 100ms
  - _Requirements: 11.5_

- [ ] 9.1 Write property test for context state propagation
  - **Property 12: Context state propagation**
  - **Validates: Requirements 11.5**

- [ ] 9.2 Write unit tests for context performance
  - Test state updates propagate to all consumers
  - Test updates occur within 100ms
  - Test unnecessary re-renders are prevented
  - _Requirements: 11.5_

- [ ] 10. Add error handling and edge cases
  - Handle missing user session gracefully
  - Handle invalid mode values from localStorage
  - Handle navigation item configuration errors
  - Add error boundaries for sidebar components
  - Log errors appropriately for debugging
  - _Requirements: 2.5, 7.4_

- [ ] 10.1 Write unit tests for error handling
  - Test missing user session defaults to CLIENT role
  - Test invalid localStorage mode resets to 'internal'
  - Test invalid navigation items are skipped
  - Test context usage outside provider throws error
  - _Requirements: 2.5, 7.4_

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Add accessibility features
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works for all controls
  - Add visible focus indicators
  - Verify color contrast meets WCAG AA standards
  - Test with screen readers
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 9.1, 9.2_

- [ ] 12.1 Write accessibility tests
  - Test keyboard navigation works
  - Test ARIA labels are present
  - Test focus indicators are visible
  - Test color contrast ratios
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 13. Optimize performance
  - Memoize NavItem components
  - Optimize icon rendering
  - Minimize context re-renders
  - Add performance monitoring
  - Profile and optimize any bottlenecks
  - _Requirements: 11.5_

- [ ] 13.1 Write performance tests
  - Test component render times
  - Test context update performance
  - Test navigation item filtering performance
  - _Requirements: 11.5_

- [ ] 14. Update documentation
  - Add JSDoc comments to all components
  - Document navigation configuration format
  - Create usage examples for developers
  - Document role and mode configuration
  - Add troubleshooting guide
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 15. Final integration testing
  - Test complete user flows for all roles
  - Test mode switching for COMPANY_OWNER and TEAM_HEAD
  - Test navigation restrictions for TEAM_MEMBER and CLIENT
  - Test mobile responsive behavior
  - Test state persistence across sessions
  - Test error scenarios
  - _Requirements: All_

- [ ] 16. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
