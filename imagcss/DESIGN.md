---
name: Ethereal Wellness
colors:
  surface: '#faf9f6'
  surface-dim: '#dadad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f1'
  surface-container: '#eeeeeb'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e3e3e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414844'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ee'
  outline: '#727973'
  outline-variant: '#c1c8c2'
  surface-tint: '#446554'
  primary: '#416352'
  on-primary: '#ffffff'
  primary-container: '#5a7c6a'
  on-primary-container: '#f5fff7'
  inverse-primary: '#aacfba'
  secondary: '#5f5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2dd'
  on-secondary-container: '#656461'
  tertiary: '#5a5d5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#727573'
  on-tertiary-container: '#fbfdfa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c6ebd5'
  primary-fixed-dim: '#aacfba'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#2c4d3d'
  secondary-fixed: '#e5e2dd'
  secondary-fixed-dim: '#c9c6c2'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#e1e3e0'
  tertiary-fixed-dim: '#c5c7c4'
  on-tertiary-fixed: '#191c1b'
  on-tertiary-fixed-variant: '#444745'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e3e0'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 80px
---

## Brand & Style

The design system is rooted in the "Organic Minimalism" movement, specifically tailored for the high-end boutique fitness and wellness sector. The brand personality is serene, encouraging, and impeccably professional. It aims to evoke the emotional response of entering a premium, sun-drenched studio—a transition from the chaotic outside world into a focused, tranquil space.

The aesthetic utilizes **Minimalism** with a **Tactile** touch, prioritizing heavy whitespace to allow content to breathe. Visual interest is generated through "natural light" gradients and soft, layered surfaces rather than aggressive decorative elements. The target audience is discerning individuals seeking a sophisticated, health-conscious lifestyle.

- **Primary Motif:** Natural light and shadow.
- **Mood:** Calm, curated, and inspiring.
- **Language Support:** Full Thai integration with optimized line-heights to prevent vowel clipping.

## Colors

The palette is inspired by natural materials: sage leaf, warm limestone, and charcoal slate. 

- **Primary (#6B8E7B):** A soft, muted Sage Green used for brand moments, primary actions, and success states.
- **Secondary (#F5F2ED):** A warm Cream "Linen" used as the primary background color to avoid the clinical feel of pure white.
- **Tertiary (#333634):** A deep Charcoal "Slate" for high-contrast typography and borders, providing a grounded, professional anchor.
- **Neutrals:** Use varying opacities of Charcoal for secondary text and subtle dividers. 

Gradients should be used sparingly on large surfaces (like header backgrounds or hero sections) to mimic the effect of morning light hitting a wall. Avoid high-vibrancy transitions; keep color shifts subtle and tonal.

## Typography

The typography strategy balances the editorial authority of **Playfair Display** with the modern, clean legibility of **Manrope**. 

**Thai Language Implementation:**
When rendering Thai characters, increase line-height by approximately 10-15% compared to English standards to accommodate stacked diacritics without crowding.

- **Headlines:** Use Playfair Display for all major headings. Its high contrast and elegant serifs communicate a "boutique" feel. Use tighter letter-spacing for large display sizes.
- **Body:** Use Manrope for all functional text. It is balanced and trustworthy, ensuring that workout plans and health data remain highly readable.
- **Labels:** Small labels use Manrope with increased letter-spacing and uppercase styling to provide a modern, organized structure.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop to maintain a premium "magazine" feel, while transitioning to a fluid model for mobile.

- **Rhythm:** A strict 8px baseline grid ensures vertical harmony. 
- **Whitespace:** Emphasize generous padding within containers. Section gaps should be large (80px+) to prevent the UI from feeling cluttered.
- **Grid:** A 12-column grid is used for desktop. For wellness dashboards, use asymmetric layouts (e.g., 4 columns for sidebar, 8 for main content) to create visual interest.
- **Mobile:** Margins are reduced to 20px, but vertical spacing remains airy to maintain the soothing aesthetic.

## Elevation & Depth

Depth is communicated through **Tonal Layers** and **Ambient Shadows** rather than stark borders.

1.  **Base Layer:** The "Linen" cream background (#F5F2ED).
2.  **Surface Layer:** Pure white cards with a very soft, diffused shadow (Blur: 30px, Y: 10px, Opacity: 4% Charcoal). This creates a "floating" effect like a linen sheet.
3.  **Interactive Depth:** On hover, elements should lift slightly (shadow increases in blur) or utilize a subtle "Natural Light" gradient shift to appear more luminous.
4.  **Glassmorphism:** Use sparingly for navigation bars or floating action buttons, employing a high-intensity backdrop blur (20px) and a semi-transparent cream tint to mimic frosted glass.

## Shapes

The shape language is dominated by organic, fluid curves.

- **Primary Elements:** All buttons and tags are **Pill-shaped** (full radius). This removes any visual "sharpness," contributing to the soothing, safe atmosphere of the brand.
- **Containers:** Large cards and image containers use `rounded-xl` (1.5rem / 24px) to maintain a soft, approachable structure.
- **Iconography:** Use line-based icons with rounded terminals. Avoid sharp corners or heavy fills.

## Components

- **Buttons:** Primary buttons are pill-shaped, filled with Sage Green (#6B8E7B) and white text. Secondary buttons use a Slate (#333634) outline with a subtle cream hover state.
- **Input Fields:** Use a subtle "Linen" fill that is slightly darker than the background. Borders should only appear on focus, using a soft Sage Green stroke.
- **Cards:** White backgrounds with `rounded-xl` corners and ambient shadows. Use for class schedules, instructor profiles, and wellness tips.
- **Chips/Tags:** Small, pill-shaped elements with low-contrast backgrounds (e.g., a 10% opacity Sage Green fill with dark green text) for categorizing workouts.
- **Progress Bars:** Use smooth, rounded tracks. The active fill should use a horizontal "natural light" gradient to show progress in a way that feels fluid rather than mechanical.
- **Lists:** Use wide spacing between items, separated by very faint 1px Charcoal lines (5% opacity) to maintain structure without breaking the visual flow.