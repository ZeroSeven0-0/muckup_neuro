# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Light Theme Colors Applied Correctly
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: theme='light' with each of the 6 affected screens
  - Test that when theme='light', each affected screen displays with:
    - backgroundColor: '#FFFFFF'
    - textColor: '#000000'
    - subtextColor: '#4B5563' (NOT '#000000')
    - cardBackgroundColor: 'rgba(255,255,255,0.75)'
    - cardBorderColor: 'rgba(15,23,42,0.12)'
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found:
    - Dashboard: `sub` variable equals '#000000' instead of '#4B5563'
    - Mi Ruta: cards use dark mode styles instead of cardLight
    - Profile: icons use ACCENT instead of '#0F172A'
    - Player: controls have insufficient contrast on white background
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Dark Theme and Other Features Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (theme='dark', highContrast mode, navigation, etc.)
  - Write property-based tests capturing observed behavior patterns:
    - Dark mode: all screens use bg '#000000', text '#FFFFFF', sub '#C7C9E8'
    - High contrast: cardHC style applied with borderColor ACCENT
    - Navigation: theme state persists across screen transitions
    - Accent color: ACCENT (#8379CD) used for buttons and links in both themes
    - Accessibility: largeText and easyReading styles apply correctly
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 3. Fix inconsistent theme colors across 6 screens

  - [ ] 3.1 Fix Dashboard (app/(tabs)/index.tsx)
    - Change `const sub = text;` to `const sub = isDark ? '#C7C9E8' : '#4B5563';`
    - Apply conditional card styles: `style={[styles.card, !isDark && styles.cardLight]}`
    - Ensure cardLight is defined in StyleSheet with backgroundColor 'rgba(255,255,255,0.75)' and borderColor 'rgba(15,23,42,0.12)'
    - Verify icon colors use conditional logic where needed
    - _Bug_Condition: isBugCondition(input) where input.theme === 'light' AND input.currentScreen === 'app/(tabs)/index.tsx'_
    - _Expected_Behavior: backgroundColor '#FFFFFF', textColor '#000000', subtextColor '#4B5563', cardLight styles applied_
    - _Preservation: Dark mode colors, ACCENT usage, high contrast, accessibility features unchanged_
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 3.2 Fix Mi Ruta (app/(tabs)/explore.tsx)
    - Change `const sub = text;` to `const sub = isDark ? '#C7C9E8' : '#4B5563';`
    - Apply conditional card styles to module cards: `style={[styles.card, !isDark && styles.cardLight]}`
    - Ensure cardLight is defined in StyleSheet (currently exists but not used)
    - _Bug_Condition: isBugCondition(input) where input.theme === 'light' AND input.currentScreen === 'app/(tabs)/explore.tsx'_
    - _Expected_Behavior: backgroundColor '#FFFFFF', textColor '#000000', subtextColor '#4B5563', cardLight styles applied_
    - _Preservation: Dark mode colors, ACCENT usage, high contrast, accessibility features unchanged_
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 3.3 Fix Sesiones (app/sessions.tsx)
    - Correct `sub` variable assignment to `const sub = isDark ? '#C7C9E8' : '#4B5563';`
    - Apply conditional card styles to session cards: `style={[styles.card, !isDark && styles.cardLight]}`
    - Define cardLight in StyleSheet if not present
    - Verify calendar and clock icon colors
    - _Bug_Condition: isBugCondition(input) where input.theme === 'light' AND input.currentScreen === 'app/sessions.tsx'_
    - _Expected_Behavior: backgroundColor '#FFFFFF', textColor '#000000', subtextColor '#4B5563', cardLight styles applied_
    - _Preservation: Dark mode colors, ACCENT usage, high contrast, accessibility features unchanged_
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 3.4 Fix Perfil (app/profile.tsx)
    - Correct `sub` variable assignment to `const sub = isDark ? '#C7C9E8' : '#4B5563';`
    - Apply conditional card styles to configuration cards: `style={[styles.card, !isDark && styles.cardLight]}`
    - Define cardLight in StyleSheet if not present
    - Fix decorative icon colors: `color={isDark ? ACCENT : '#0F172A'}`
    - _Bug_Condition: isBugCondition(input) where input.theme === 'light' AND input.currentScreen === 'app/profile.tsx'_
    - _Expected_Behavior: backgroundColor '#FFFFFF', textColor '#000000', subtextColor '#4B5563', cardLight styles applied, icons use '#0F172A'_
    - _Preservation: Dark mode colors, ACCENT usage, high contrast, accessibility features unchanged_
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 3.5 Fix Detalle de curso (app/course/[id].tsx)
    - Correct `sub` variable assignment to `const sub = isDark ? '#C7C9E8' : '#4B5563';`
    - Apply conditional card styles to lesson cards: `style={[styles.card, !isDark && styles.cardLight]}`
    - Define cardLight in StyleSheet if not present
    - Verify media type icon colors (video/podcast)
    - _Bug_Condition: isBugCondition(input) where input.theme === 'light' AND input.currentScreen === 'app/course/[id].tsx'_
    - _Expected_Behavior: backgroundColor '#FFFFFF', textColor '#000000', subtextColor '#4B5563', cardLight styles applied_
    - _Preservation: Dark mode colors, ACCENT usage, high contrast, accessibility features unchanged_
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 3.6 Fix Reproductor (app/player/[lessonId].tsx)
    - Correct `sub` variable assignment to `const sub = isDark ? '#C7C9E8' : '#4B5563';`
    - Apply conditional styles to player controls for light mode visibility
    - Define cardLight in StyleSheet if not present
    - Ensure control buttons are visible on white background
    - _Bug_Condition: isBugCondition(input) where input.theme === 'light' AND input.currentScreen === 'app/player/[lessonId].tsx'_
    - _Expected_Behavior: backgroundColor '#FFFFFF', textColor '#000000', subtextColor '#4B5563', controls visible with adequate contrast_
    - _Preservation: Dark mode colors, ACCENT usage, high contrast, accessibility features unchanged_
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 3.7 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Light Theme Colors Applied Correctly
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_

  - [ ] 3.8 Verify preservation tests still pass
    - **Property 2: Preservation** - Dark Theme and Other Features Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Run all tests (exploration + preservation)
  - Verify all 6 screens display correctly in light mode
  - Verify dark mode and accessibility features still work
  - Ask the user if questions arise
