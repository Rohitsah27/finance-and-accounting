# VeriDex Platform — Global UI/UX Design Framework

**Version:** 3.0  
**Status:** Active  
**Maintained by:** Platform Design & Architecture  
**Applies to:** All VeriDex product modules and internal tooling built on the VeriDex design system  
**Last updated:** 27-Aug-2026

> This document is the **single source of truth** for all visual, interaction, and structural decisions across every module built on the VeriDex platform. All module-level READMEs inherit from this document. No module may deviate from this system without a documented exception reviewed by the Platform Design team.

### Normative Language & Decision Hierarchy

The words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative requirements. Where this framework conflicts with a module README, this framework wins unless an approved exception is recorded. Where this framework conflicts with an applicable legal, regulatory, security, privacy, or accessibility requirement, the stricter external requirement wins.

Implementation authority order:
1. Applicable law, regulation, contractual obligation, and security/privacy policy.
2. This Global UI/UX Framework.
3. Shared component and token implementation in `/platform/assets/`.
4. Module-level README and module-specific patterns.
5. Local implementation choices.

A screenshot, prototype, legacy page, or stakeholder preference is not authority to override a MUST-level rule.

---

## Table of Contents

1. Design Philosophy
2. Brand Identity
3. Color System
4. Typography
5. Shell Architecture & Navigation
6. Content Grid
7. Spacing Scale
8. Z-Index Scale
9. Page Header Pattern
10. Component Library
11. Iconography
12. Interaction Patterns
13. Focus Management
14. Animation & Motion
15. Accessibility Baseline
16. Responsive Behavior
17. Dark Mode & Theme Strategy
18. Link & Anchor Styling
19. Print & Export Strategy
20. Error & Validation Strategy
21. Cross-Module Navigation Handoff
22. App Loading & Splash Behavior
23. Browser Tab & Favicon Spec
24. Marketing-to-Product Handoff
25. Framework Versioning & Change Governance
26. Shared Asset Architecture
27. Dummy Data Conventions
28. Module Onboarding Checklist
29. Standards & Compliance Baseline
30. Semantic HTML & ARIA Contract
31. Internationalization, Localization & RTL
32. Browser, Viewport & Input Support
33. Content, Microcopy & Naming
34. Data Presentation & Locale Formatting
35. Security, Privacy & Session UX
36. Quality Gates, Testing & Release Evidence

---

## 1. Design Philosophy

The VeriDex platform serves insurance professionals — product managers, actuaries, underwriting managers, compliance officers, and operations engineers — who operate under high cognitive load, work with dense data, and have zero tolerance for ambiguity. Different teams will build different modules on this platform, but every module must feel like it belongs to the same product.

The design must communicate **authority, clarity, and trust** at every interaction point, while carrying the VeriDex brand identity: confident, modern, and intelligence-driven. The brand voice is *Trusted Intelligence. Insurance Transformed.*

### Core Design Tension

The platform handles two fundamentally different work modes, and both must feel native to the same system without feeling like two different products:

- **Configuration work** (long-form, multi-field, high density): product setup, rule authoring, rate table editing. These pages need progressive disclosure, dense field layouts, and clear save/cancel semantics.
- **Governance work** (decision, audit, approval): reviewing, approving, and tracking changes. These pages need scannable status, visible history, and unambiguous action clarity.

Module teams must identify which mode their pages serve and design accordingly — but always within this shared system. A governance page that feels like a configuration form, or a configuration form that buries status, is a failure of this system.

### Three Operating Principles

1. **Brand coherence over module autonomy.** Each module team controls its content and layout, but never overrides the token system, shell architecture, or core component library.
2. **Data density without chaos.** Visual decisions are made in service of workflow velocity, not aesthetic novelty. Every label, icon, status badge, and layout choice must encode something true about the data or action it represents.
3. **Every visual decision encodes truth.** Labels, icons, status badges, and layout choices must reflect the data or action they represent — not decorate it.

---

## 2. Brand Identity

### Logo & Wordmark

The VeriDex logo consists of two elements: the **vD monogram mark** (an angular, stylized "v" and "D" in orange-amber gradient) and the **VeriDex wordmark** ("Veri" in white or charcoal + "Dex" in orange). Usage rules:

- **On dark backgrounds (topbar, shell):** Full lockup in white + orange. Monogram retains its gradient.
- **On light backgrounds:** Full lockup in charcoal + orange. Monogram retains its gradient.
- **Minimum clear space:** Equal to the height of the lowercase "e" in the wordmark on all sides.
- **In the topbar:** Full logo lockup (mark + wordmark) in the left zone.
- **Favicon / icon-only contexts:** vD monogram mark only (see §23).
- **Never:** Recolor the monogram mark, apply drop shadows, stretch the lockup, use the wordmark without the mark in product UI, or separate mark from wordmark without explicit design approval.

### Brand Voice in UI

- Headlines and page titles carry authority: short, declarative, confident.
- Labels and actions are plain and specific. Name things by what users control, not how the system is built.
- Error messages are direct and actionable — never vague, never apologetic.
- Empty states invite action, not apology.
- Success messages confirm the action taken — not the system state. "Version published" not "Status updated to Published."

---

## 3. Color System

All colors are defined as CSS custom properties on `:root` in `style.css`. **Module teams must consume tokens — never hard-code hex values in module CSS.**

### Authoritative CSS Token Block

Copy this block verbatim into `/platform/assets/style.css`. This is the single definition of all platform tokens. Module stylesheets import this file and reference only these variables.

```css
:root {
  /* Brand */
  --color-brand:            #F97316;
  --color-brand-dark:       #EA6A08;
  --color-brand-amber:      #F59E0B;
  --color-brand-light:      #FFF7ED;
  --color-link:             #C2410C;   /* accessible text-link color on light surfaces */
  --color-focus:            #C2410C;   /* focus indicator on light surfaces */
  --color-control-border:   #6B7280;   /* form/control boundary; >=3:1 on light surfaces */
  --color-on-brand:         #0D1117;   /* text/icons on orange brand fills */
  --color-brand-gradient:   linear-gradient(135deg, #F97316, #F59E0B);

  /* Shell (dark zones: topbar, left nav) */
  --color-shell:            #1A1D23;
  --color-shell-accent:     #22262E;
  --color-border-dark:      #2E333D;

  /* Surfaces */
  --color-ink:              #0D1117;
  --color-ink-secondary:    #374151;
  --color-surface:          #F7F8FA;
  --color-panel:            #FFFFFF;
  --color-border:           #E2E5EA;

  /* Status — foreground */
  --status-draft:           #475569;
  --status-review:          #B45309;   /* amber-dark — not yellow */
  --status-approved:        #1D4ED8;
  --status-published:       #15803D;
  --status-superseded:      #7C3AED;
  --status-retired:         #4B5563;

  /* Status — badge backgrounds */
  --status-draft-bg:        #F1F5F9;
  --status-review-bg:       #FEF3C7;   /* amber-dark bg — not yellow */
  --status-approved-bg:     #DBEAFE;
  --status-published-bg:    #DCFCE7;
  --status-superseded-bg:   #EDE9FE;
  --status-retired-bg:      #F3F4F6;

  /* Functional */
  --color-success:          #15803D;
  --color-warning:          #B45309;
  --color-danger:           #DC2626;
  --color-info:             #0369A1;
  --color-muted:            #6B7280;
  --color-disabled:         #D1D5DB;
  --color-success-bg:       #F0FDF4;
  --color-warning-bg:       #FFFBEB;
  --color-danger-bg:        #FEF2F2;
  --color-info-bg:          #EFF6FF;

  /* Outcome decisions (decisioning modules only) */
  --outcome-accept:         #15803D;
  --outcome-decline:        #DC2626;
  --outcome-refer:          #B45309;
  --outcome-load:           #7C3AED;
  --outcome-restrict:       #0369A1;
  --outcome-evidence:       #0F766E;

  /* Spacing */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Z-index scale */
  --z-base:       0;
  --z-raised:     10;
  --z-dropdown:   100;
  --z-sticky:     200;
  --z-overlay:    300;
  --z-drawer:     400;
  --z-modal:      500;
  --z-toast:      600;
  --z-tooltip:    700;
}
```

### Token Reference Tables

#### Brand Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-brand` | `#F97316` | Brand fills, borders, active nav accent, key highlights; not for normal-size text on light surfaces |
| `--color-brand-dark` | `#EA6A08` | Brand hover and pressed states |
| `--color-brand-amber` | `#F59E0B` | Gradient endpoint, warm accent — use sparingly |
| `--color-brand-light` | `#FFF7ED` | Active nav tint, selected row tint, brand surface |
| `--color-link` | `#C2410C` | Text links and interactive text on light surfaces; WCAG AA contrast target |
| `--color-focus` | `#C2410C` | Keyboard focus outlines on light surfaces |
| `--color-control-border` | `#6B7280` | Boundaries for inputs, selects, checkboxes, radios, and other controls |
| `--color-on-brand` | `#0D1117` | Text and icons placed on orange brand fills |
| `--color-brand-gradient` | `linear-gradient(135deg, #F97316, #F59E0B)` | Logo mark, hero accents, key CTAs only |

#### Shell & Surface

| Token | Hex | Usage |
|---|---|---|
| `--color-shell` | `#1A1D23` | Topbar and left nav background |
| `--color-shell-accent` | `#22262E` | Nav item hover background |
| `--color-border-dark` | `#2E333D` | Borders within dark shell zones |
| `--color-ink` | `#0D1117` | Primary text, high-emphasis labels |
| `--color-ink-secondary` | `#374151` | Secondary body text |
| `--color-surface` | `#F7F8FA` | Page backgrounds |
| `--color-panel` | `#FFFFFF` | Cards, modals, sidebars |
| `--color-border` | `#E2E5EA` | Dividers, field borders, table lines |

#### Semantic Status Colors

Non-negotiable. Every status indicator, badge, and state marker must use these and only these. Do not substitute lighter yellows or alternative ambers for the review tokens — the specific dark amber is intentional.

| Token | Hex | Status |
|---|---|---|
| `--status-draft` | `#475569` | Draft |
| `--status-review` | `#B45309` | In Review (amber-dark — not yellow) |
| `--status-approved` | `#1D4ED8` | Approved |
| `--status-published` | `#15803D` | Published / Live |
| `--status-superseded` | `#7C3AED` | Superseded |
| `--status-retired` | `#4B5563` | Retired |
| `--status-draft-bg` | `#F1F5F9` | Draft badge background |
| `--status-review-bg` | `#FEF3C7` | In Review badge background (amber-dark bg — not yellow) |
| `--status-approved-bg` | `#DBEAFE` | Approved badge background |
| `--status-published-bg` | `#DCFCE7` | Published badge background |
| `--status-superseded-bg` | `#EDE9FE` | Superseded badge background |
| `--status-retired-bg` | `#F3F4F6` | Retired badge background |

All status foreground/background pairs in v3.0 are selected to meet at least 4.5:1 text contrast for normal-size badge labels. Teams MUST use the defined pair; do not mix foreground and background tokens across statuses.

#### Functional Accent Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-success` | `#15803D` | Success text, borders, icons |
| `--color-warning` | `#B45309` | Warning text, borders, icons |
| `--color-danger` | `#DC2626` | Destructive actions, validation errors, declines |
| `--color-info` | `#0369A1` | Info text, borders, icons |
| `--color-muted` | `#6B7280` | Secondary text, placeholder text, metadata |
| `--color-disabled` | `#D1D5DB` | Disabled control surfaces; not text |
| `--color-success-bg` | `#F0FDF4` | Success callout/background surface |
| `--color-warning-bg` | `#FFFBEB` | Warning callout/background surface |
| `--color-danger-bg` | `#FEF2F2` | Error/destructive callout background |
| `--color-info-bg` | `#EFF6FF` | Informational callout background |

#### Outcome Decision Colors (Decisioning Modules Only)

Module teams building underwriting or decisioning features must use these tokens. General-purpose modules do not use these.

| Token | Hex | Usage |
|---|---|---|
| `--outcome-accept` | `#15803D` | Accept decisions |
| `--outcome-decline` | `#DC2626` | Decline decisions |
| `--outcome-refer` | `#B45309` | Refer decisions |
| `--outcome-load` | `#7C3AED` | Loading outcomes |
| `--outcome-restrict` | `#0369A1` | Cover restriction outcomes |
| `--outcome-evidence` | `#0F766E` | Evidence requirements |

---

## 4. Typography

### Typeface Stack

The platform uses **Inter** (body and UI) and **IBM Plex Mono** (code, IDs, rate values, technical tokens). Inter is a purpose-built UI typeface with exceptional tabular figure support. IBM Plex Mono signals machine-readable identifiers without decorative distraction.

Both must be loaded from the shared `style.css` import — module stylesheets must not import fonts independently.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
```

Google Fonts CDN is acceptable for prototypes. Production builds must self-host both fonts.

Recommended stacks: `Inter, system-ui, -apple-system, "Segoe UI", sans-serif` and `"IBM Plex Mono", ui-monospace, "SFMono-Regular", Consolas, monospace`. Font fallback MUST NOT block content rendering.

### Type Scale

| Role | Typeface | Weight | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Page Title | Inter | 700 | 24px | 32px | -0.3px |
| Section Heading | Inter | 600 | 18px | 26px | -0.2px |
| Card Heading | Inter | 600 | 15px | 22px | 0 |
| Body / Default | Inter | 400 | 14px | 22px | 0 |
| Body Emphasis | Inter | 500 | 14px | 22px | 0 |
| Table Header | Inter | 600 | 12px | 18px | 0.4px (uppercase) |
| Label / Meta | Inter | 400 | 12px | 18px | 0 |
| Nav Label | Inter | 500 | 13px | 20px | 0 |
| Nav Group Label | Inter | 600 | 11px | 16px | 0.6px (uppercase) |
| Monospace (IDs, formulas, code) | IBM Plex Mono | 400 | 13px | 20px | 0 |
| Monospace Emphasis | IBM Plex Mono | 600 | 13px | 20px | 0 |

### Usage Rules

- **All table column headers are uppercase, 12px, letter-spaced.** Distinguishes headers from data values at a glance.
- **All entity IDs render in IBM Plex Mono.** Signals machine-readable, non-editable identifiers.
- **Status badges, role chips, and outcome indicators are always 12px Inter 500, uppercase.**
- **Never use font-weight 300 (thin).** The data is precise; thin type undermines authority.
- Sentence case everywhere except: table headers (uppercase), badge/tag labels (uppercase), nav group labels (uppercase).
- **Never use decorative fonts.** Define deterministic fallback stacks for Inter and IBM Plex Mono so text remains immediately readable while web fonts load; production fonts are self-hosted and loaded with `font-display: swap`.

---

## 5. Shell Architecture & Navigation

The platform shell is the persistent structural frame shared by all modules. Module teams render content **inside the Main Content Area only**. The topbar and left nav are owned by the platform team and rendered via `nav.js`. Module teams must not reimplement or override the shell.

### Three-Zone Shell

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOPBAR (56px fixed height, --color-shell background)               │
│  [vD VeriDex logo]  [Breadcrumb]          [Search] [🔔] [👤 Role]  │
├──────────────────┬──────────────────────────────────────────────────┤
│                  │                                                  │
│  LEFT NAV        │  MAIN CONTENT AREA                               │
│  (240px fixed)   │  (fluid, max-width 1280px, 32px padding L/R)    │
│                  │                                                  │
│  --color-shell   │  Page Header (title + subtitle + actions)        │
│  background      │  ────────────────────────────────────────        │
│  full-height     │  Module Content (owned by module team)           │
│  scrollable      │                                                  │
│                  │                                                  │
└──────────────────┴──────────────────────────────────────────────────┘
```

**Topbar (56px fixed):** Dark shell background (`--color-shell`). Left zone: full VeriDex logo lockup + global breadcrumb. Right zone: global search input, notification bell, user avatar with role chip.

**Left Nav (240px fixed):** Dark shell background, full-height, scrollable. Collapsible to 64px icon-only mode via a toggle at the bottom. Toggle state persists per-user in localStorage. Expanded: icon + label. Collapsed: icon only, with tooltip on hover showing the full label.

**Main Content Area:** Fluid. Max content width 1280px, centered, 32px horizontal padding. Each module owns its layout within this zone.

### Navigation Structure

Group labels: uppercase, 11px Inter 600, `--color-muted`, 0.6px letter-spacing. Nav item height: 44px. Horizontal padding: 16px. Icon-to-label gap: 8px.

```
[vD VeriDex]                    ← full logo lockup, 20px padding
──────────────────────────────
  PLATFORM
  Dashboard                     ← House
  Notifications                 ← Bell

──────────────────────────────
  [MODULE GROUP LABEL]          ← registered by module team
  [Module Nav Items]            ← registered by module team

──────────────────────────────
  ADMINISTRATION
  Integration Monitor           ← Plugs
  Roles & Access Control        ← Users
  Audit Log                     ← ClockCounterClockwise
  Glossary                      ← Book

──────────────────────────────
  [User Role Badge]
  [← Collapse Nav]
```

**Module nav registration** (in `nav.js`):

```javascript
VeriDexNav.registerModule({
  groupLabel: 'PRODUCT DESIGN',
  items: [
    { id: 'catalogue', label: 'Product Catalogue',       icon: 'BookOpen',   href: '/modules/product/catalogue.html' },
    { id: 'coverage',  label: 'Coverage Studio',          icon: 'Umbrella',   href: '/modules/product/coverage.html' },
    { id: 'rating',    label: 'Rating & Pricing Studio',  icon: 'Calculator', href: '/modules/product/rating.html' },
    // ... additional module pages
  ]
});
```

Module teams choose their own Phosphor icon names per item. Icon choices must not duplicate existing platform-level nav icons (see §11).

### Nav State Specifications

| State | Background | Left border | Text + icon color |
|---|---|---|---|
| Default | transparent | none | `--color-muted` |
| Hover | `--color-shell-accent` | none | `#FFFFFF` |
| Active (current page) | `--color-brand-light` at 15% opacity | 3px solid `--color-brand` | `--color-brand` |

The active state produces a warm orange left-accent against the dark shell — this is the primary brand expression in the navigation.

### Breadcrumb (Topbar)

Always shows: `[Module Name] › [Section] › [Page] › [Sub-context if any]`

Rightmost crumb: non-clickable (current page). All others: links. See §10.11 for full breadcrumb component spec. For cross-module navigation context, see §21.

---

## 6. Content Grid

All module pages use a **12-column grid at 1280px** with 24px gutters.

| Layout Pattern | Column Split |
|---|---|
| Full-width table / list page | 12 columns |
| Detail page with sidebar | 8 cols content + 4 cols sidebar (right) |
| Configuration / form + preview | 7 cols form/editor + 5 cols preview/context |
| Dashboard metric row (4-up) | 3 cols × 4 cards |
| Dashboard metric row (3-up) | 4 cols × 3 cards |
| Standard modal | Fixed 640px |
| Wide modal (simulators, comparators) | Fixed 960px |

---

## 7. Spacing Scale

All spacing is derived from a **4px base unit**. No module may introduce spacing values outside this scale. All values are defined in the `:root` token block (§3).

| Token | Value | Common Usage |
|---|---|---|
| `--space-1` | 4px | Inline icon gap, tight label padding |
| `--space-2` | 8px | Badge padding, chip padding |
| `--space-3` | 12px | Field internal padding |
| `--space-4` | 16px | Card padding (compact), row padding |
| `--space-5` | 20px | Default row / cell padding |
| `--space-6` | 24px | Card padding (standard), section gap |
| `--space-8` | 32px | Page section gap |
| `--space-10` | 40px | Page header bottom margin |
| `--space-12` | 48px | Large section separator |

---

## 8. Z-Index Scale

All z-index values are defined as tokens in the `:root` block and must be consumed by name. Hard-coded z-index integers in module CSS are not permitted. The scale is ordered to prevent any module's overlays from conflicting with platform-level layers.

| Token | Value | Layer |
|---|---|---|
| `--z-base` | 0 | Normal document flow |
| `--z-raised` | 10 | Elevated cards, sticky table headers |
| `--z-dropdown` | 100 | Select menus, autocomplete dropdowns, popovers |
| `--z-sticky` | 200 | Sticky page headers, floating toolbars |
| `--z-overlay` | 300 | Drawer background dim overlay |
| `--z-drawer` | 400 | Side drawers |
| `--z-modal` | 500 | Modals and their background dim overlay |
| `--z-toast` | 600 | Toast notifications |
| `--z-tooltip` | 700 | Tooltips — always on top |

**Rule:** A module may not use `--z-modal` or above for anything other than its designated component type. A module dropdown must never appear above a platform modal. If a stacking conflict is discovered, it must be resolved via the token scale — not by bumping an integer.

---

## 9. Page Header Pattern

Every module page uses a consistent header zone at the top of the Main Content Area:

```
[Page Title]                              [Secondary Action]  [Primary Action]
[Subtitle / context description]
[Tab bar — if page uses tabs]
────────────────────────────────────────────────────────────────────────────────
[Content]
```

- Page title: 24px Inter 700, `--color-ink`
- Subtitle: 14px `--color-muted`
- Primary action: right-aligned, Primary button (`--color-brand` fill, `--color-on-brand` text, 6px radius)
- Secondary actions: right-aligned, left of primary, Secondary or Ghost variant
- Tab bar (if used): immediately below title/subtitle, before the divider line
- Bottom margin before content: `--space-8` (32px)

---

## 10. Component Library

All components are provided by the platform component library (`components.js`). **Module teams do not reimplement these.** If a module needs a variant not listed here, it must be proposed to the Platform Design team and added to this document before implementation.

### 10.1 Status Badge

Used on any entity to show lifecycle state.

```
[ PUBLISHED ]   --status-published-bg fill, --status-published text
[ DRAFT     ]   --status-draft-bg fill, --status-draft text
[ IN REVIEW ]   --status-review-bg fill, --status-review text
[ APPROVED  ]   --status-approved-bg fill, --status-approved text
[ SUPERSEDED]   --status-superseded-bg fill, --status-superseded text
[ RETIRED   ]   --status-retired-bg fill, --status-retired text
```

- Fixed height: 20px
- Padding: 0 8px
- Font: 12px Inter 500, uppercase
- Border-radius: 4px
- No icons inside badges. Icon + badge combination is allowed — icon rendered left of badge, never inside.

### 10.2 Outcome Badge (Decisioning Modules Only)

Same shape as status badge. Used only by modules with underwriting or decisioning surfaces.

```
[ ACCEPT ]    --outcome-accept (green)
[ DECLINE ]   --outcome-decline (red)
[ REFER ]     --outcome-refer (amber-dark)
[ LOAD ]      --outcome-load (purple)
[ RESTRICT ]  --outcome-restrict (blue)
[ EVIDENCE ]  --outcome-evidence (teal)
```

### 10.3 Buttons

| Variant | Style | Usage |
|---|---|---|
| Primary | `--color-brand` fill, `--color-on-brand` text, 1px `--color-link` border, **6px radius** | Main page action — one per page |
| Primary Gradient | `--color-brand-gradient` fill, `--color-on-brand` text, 1px `--color-link` border, **6px radius** | Hero CTAs, onboarding — use sparingly |
| Secondary | White fill, `--color-border` border, `--color-ink` text, 4px radius | Secondary actions |
| Danger | `--color-danger` fill, white text, 4px radius | Destructive actions |
| Ghost | No fill, no border, `--color-link` text | Inline actions, table row actions |
| Icon-only | 36×36px, `--color-surface` fill, icon centered — **`aria-label` required** | Compact toolbar actions |

Height: 36px. Padding: 0 16px.  
Disabled: `--color-disabled` fill, `--color-muted` text, `cursor: not-allowed`.  
Loading: spinner replaces label. Button width locked during loading — no layout shift.

> **Brand rule:** Primary and Primary Gradient use 6px border-radius to distinguish them visually as the primary call-to-action. All other variants use 4px. Never use the legacy blue (`#1A4F8A`) as a primary button color.

### 10.4 Table

- **Header row:** `--color-surface` background, uppercase 12px Inter 600, `--color-border` bottom border 2px
- **Data rows:** `--color-panel` background, `--color-border` bottom border 1px
- **Row hover:** `--color-brand-light` background, instant (no transition)
- **Selected row:** `--color-brand-light` background + 3px `--color-link` inline-start border
- **Row heights:** 48px standard | 40px compact | 56px with sub-text
- **Column alignment:** text left-aligned, numeric right-aligned, status badges centered
- **Sortable columns:** caret icon right of label; active sort shows filled caret in `--color-brand`
- **Empty state:** see §10.10

### 10.5 Form Fields

- Label: 13px Inter 500, `--color-ink`, 6px margin below label to field top
- Input height: 38px
- Border: 1px `--color-control-border`, 4px radius. `--color-border` is decorative and MUST NOT be the sole boundary for an interactive field.
- Focus: 2px `--color-focus` outline (offset 2px), border color switches to `--color-focus`
- Error: border `--color-danger`, 12px error text below field in `--color-danger` with ✕ icon
- Help text: 12px `--color-muted`, below field, always visible (never on hover only)
- Required indicator: asterisk (`*`) in `--color-danger` after label text — never inside placeholder
- Placeholder text: `--color-muted` — never a substitute for a visible label
- Disabled: `--color-disabled` background, `--color-muted` text

**Field types available in the component library:**
- Text input (single-line)
- Textarea (resizable, min 3 rows)
- Select (native-styled with custom caret)
- Multi-select (tag-style with remove ×)
- Date picker (calendar popover)
- Date range picker (two linked calendar popovers)
- Toggle switch (boolean, 40×22px, `--color-brand` when on)
- Checkbox (18×18px, `--color-brand` check)
- Radio group (vertical list, 18×18px)
- Number input with up/down steppers
- Currency input (symbol prefix, right-aligned value)
- Percentage input (% suffix)
- Formula input (monospace, syntax-highlighted, with inline validator)
- Code / expression editor (multi-line, IBM Plex Mono, line numbers)

### 10.6 Tabs

**Page-level tabs (underline style):** 15px Inter 500. Active: 2px `--color-link` underline, `--color-link` text. Default: `--color-muted` text. Height: 44px. Used for top-level section switching within a page.

**Panel tabs (pill style):** 13px Inter 500. Active: `--color-brand-light` fill, `--color-link` text. Default: no fill, `--color-muted` text. Used within cards or panels for sub-section switching.

### 10.7 Card

```css
border: 1px solid var(--color-border);
border-radius: 8px;
background: var(--color-panel);
padding: var(--space-6);          /* 24px */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
```

Card header (when present): 15px Inter 600 heading + optional 13px `--color-muted` sub-heading + optional ghost/icon-only action right-aligned. Divider below header: 1px `--color-border`.

**Metric / KPI card variant (dashboards):** Large number (28px Inter 700), label (13px `--color-muted`), optional trend indicator (arrow + % change, `--color-success` for positive, `--color-danger` for negative).

### 10.8 Callout / Alert Banner

Horizontal band with 4px left-colored border, icon, and text.

| Type | Left border | Icon | Background |
|---|---|---|---|
| Info | `--color-info` | ⓘ | `--color-info-bg` |
| Warning | `--color-warning` | ⚠ | `--color-warning-bg` |
| Error | `--color-danger` | ✕ | `--color-danger-bg` |
| Success | `--color-success` | ✓ | `--color-success-bg` |
| Brand | `--color-brand` | → | `#FFF7ED` |

Height: auto, min 44px. Padding: 12px 16px. Dismissible variant has × icon right-aligned. The Brand callout type is used for platform announcements and onboarding nudges only.

### 10.9 Toast Notifications

Appear top-right, stack vertically (newest on top). Auto-dismiss after 5 seconds. Error toasts require manual dismiss. Z-index: `--z-toast`.

Width: 360px. Padding: 14px 16px. Border-radius: 8px. Drop shadow: `0 4px 12px rgba(0,0,0,0.12)`.

| Type | Left border | Icon color |
|---|---|---|
| Success | `--color-success` | `--color-success` |
| Error | `--color-danger` | `--color-danger` |
| Warning | `--color-warning` | `--color-warning` |
| Info | `--color-info` | `--color-info` |

### 10.10 Empty States

Centered in the container (vertically and horizontally). Structure:
- Illustration: 120×120px SVG, outlined style, `--color-muted` stroke, no filled character depictions
- Heading: 16px Inter 600, `--color-ink`
- Description: 14px `--color-muted`, max 280px wide, centered
- Primary action button (when an action is available)

**Writing rule:** State what can be done, not what is absent. "No records yet. Create your first [entity] to get started." — not "No records found."

### 10.11 Breadcrumb

`Module Name › Section › Page › Record Name`

- 13px Inter 400
- Separator: `›` in `--color-muted`
- Clickable crumbs: `--color-link`, underline on hover
- Current crumb: `--color-ink`, not clickable
- Max 4 levels. Beyond 4: `…` ellipsis collapses middle segments; tooltip on hover shows full path.

### 10.12 Pagination

Used on all tables with more than 20 rows.

```
Showing 1–25 of 142     [< Prev]  [1] [2] [3] … [6]  [Next >]
```

- 13px Inter 400
- Active page: `--color-brand` fill, `--color-on-brand` text, 1px `--color-link` border, 4px radius
- Items-per-page selector (dropdown): 25 / 50 / 100

### 10.13 Inline Validation Indicator

For formula fields, rule conditions, and expression editors: live syntax validation as user types.

- **Valid:** green checkmark right of field, "Valid expression" in 12px `--color-success`
- **Invalid:** red ✕, specific error message in 12px `--color-danger`
- **Validating:** spinner, debounced 400ms after last keystroke

### 10.14 Diff / Version Comparison Panel

Two-column side-by-side layout with change highlighting.

- Removed content: `--color-danger-bg` background, `--color-danger` left border
- Added content: `--color-success-bg` background, `--color-success` left border
- Changed value: amber underline; amber pill showing the old value on hover

### 10.15 Stepper / Progress Indicator

For multi-step workflows (wizards, publish flows). Horizontal bar above content. Each step: numbered circle + label below.

- Completed: `--color-success` filled circle, checkmark, `--color-success` connector
- Active: `--color-brand` filled circle with 1px `--color-link` border, `--color-on-brand` number, `--color-link` label
- Upcoming: `--color-border` circle, `--color-muted` label, `--color-border` connector

### 10.16 Confirmation Modal

For destructive or irreversible actions (delete, retire, publish). Z-index: `--z-modal`.

- Width: 480px
- Header: action name (e.g., "Retire Record", "Delete Version")
- Body: plain-language explanation of what will happen and what cannot be undone
- High-stakes actions: requires user to type a confirmation string (e.g., the record ID) before confirm button activates
- Buttons: [Cancel] (secondary) + [action verb] (danger or primary depending on action)

### 10.17 Drawer (Side Panel)

Slides in from the right. For record detail preview without navigating away from the list. Z-index: `--z-drawer`. Background dim overlay: `--z-overlay`.

- Width: 480px standard | 640px wide (rule detail or complex records)
- Overlay: `rgba(0,0,0,0.3)` dimming the main content area
- Header: entity name, status badge, close ×
- Footer: primary action + secondary actions
- Closing returns to list with scroll position and selection state preserved

### 10.18 Data Density Toggle

All data-heavy modules must support two density modes toggled from the topbar. Preference persists per-user in localStorage. Switching modes must not trigger a page reload.

| Mode | Row height | Font size | Card padding |
|---|---|---|---|
| **Comfortable** (default) | 48px | 14px | 24px |
| **Compact** | 36px | 13px | 16px |

---

## 11. Iconography

Icon library: **Phosphor Icons** (regular weight default; bold for active and emphasis states). Sizes: 20×20px standard, 16×16px inline/compact.

Do not mix Phosphor with other icon libraries. No filled icons except for status indicator states and active toggle states.

**Platform-level nav icons — reserved; module teams must not reuse these:**

| Page | Phosphor Icon |
|---|---|
| Dashboard | `House` |
| Notifications | `Bell` |
| Integration Monitor | `Plugs` |
| Roles & Access Control | `Users` |
| Audit Log | `ClockCounterClockwise` |
| Glossary | `Book` |

Module teams choose their own Phosphor icon names per nav item and register them via the nav registry (§5). Icon choices must not duplicate the reserved set above.

---

## 12. Interaction Patterns

These patterns apply across all modules. Module teams implement them using the shared behaviors in `components.js` — do not reimplement from scratch.

### Inline Editing

Tables and detail views support inline editing for non-governance-sensitive fields. Clicking a value activates the field in-place. Escape cancels with no save. Enter or click-outside saves, with an auto-save indicator in the topbar.

**Governance-sensitive fields are never inline-editable.** This specifically includes: rate values, rule conditions, coverage financial limits, underwriting thresholds, and any field that feeds into a published or approved artifact. These fields require navigating to the relevant form and following the governed edit flow.

### Save Feedback & Optimistic UI

Optimistic UI is allowed only for **low-risk, reversible actions** where temporary divergence from server state cannot mislead the user about a governed, financial, legal, or security-relevant outcome.

- Low-risk reversible edits MAY update optimistically and revert with clear failure feedback.
- Publish, approve, bind, issue, pay, delete, permission, financial-posting, and other governed/high-impact actions MUST wait for authoritative server confirmation before presenting a completed state.
- While confirmation is pending, show a clear pending/loading state and prevent accidental duplicate submission.
- A failed save preserves user-entered data where safe and provides a recovery path.
- Full-page reloads SHOULD NOT be used as routine save behavior; deliberate navigation/reload for authentication, recovery, or architecture-specific reasons is permitted when user context is preserved.

### Dirty State Warning

If a user has unsaved form changes and attempts to leave — via nav click, browser back, tab close, or browser close — a browser-native confirm dialog blocks navigation:

> *"You have unsaved changes. Leave anyway?"*

All four vectors must trigger this: left nav click, topbar link, browser back, browser/tab close.

### Loading States

- **Page-level data load:** Skeleton screens — not spinners. Each card and table shows animated grey skeleton shapes matching the expected layout. Shape sizes mirror real content proportions.
- **Action-level load:** The triggering button shows a spinner and is disabled. No other overlay or blocking element appears.
- **Background processes (compile, publish, batch):** Progress indicator in the topbar notification area. A dedicated status card on the module's dashboard page.

### Keyboard Navigation

- All interactive elements reachable by Tab in logical document order.
- All modals trap focus within the modal until dismissed.
- All dropdowns and popovers close on Escape.
- Semantic data tables use normal browser Tab navigation for interactive controls. Arrow-key cell/row navigation is used only when the component intentionally implements an ARIA grid/treegrid pattern.

### Tooltips

- **Trigger:** hover (300ms delay) or keyboard focus
- **Positioning:** auto (prefer above; flip if near viewport edge)
- **Max width:** 280px
- **Content:** plain text only — no HTML, no links inside tooltips
- **Z-index:** `--z-tooltip`
- **When to use:** icon-only buttons (required), truncated text, help text for complex fields, full ID values when display truncates them

---

## 13. Focus Management

Focus management must be explicitly implemented — not left to browser defaults. Module teams are responsible for correct focus behavior within their components, using the following platform rules.

### After Modal Opens
Focus moves to the first focusable element inside the modal (typically the heading or first interactive element). Focus is trapped inside until the modal is dismissed.

### After Modal Closes
Focus returns to the exact element that triggered the modal to open. If that element no longer exists (e.g., a deleted row), focus moves to the next logical element in the document.

### After Drawer Opens
Focus moves to the drawer header or first focusable element inside the drawer.

### After Drawer Closes
Focus returns to the element that triggered the drawer.

### After Toast Appears
Focus does not move. Toasts are announced via `role="alert"` (which triggers screen reader announcement without stealing focus).

### After Inline Save (Optimistic UI)
Focus remains on the field or moves to the next logical editable field if the user pressed Tab to save.

### After Destructive Action (Row Delete)
Focus moves to the row that now occupies the same position (i.e., the row below the deleted one). If the last row was deleted, focus moves to the table's "Add" action or the empty state's primary action button.

### After Interactive Grid Navigation (Arrow Keys)
When a component intentionally implements an ARIA grid/treegrid, arrow-key navigation follows the documented shared grid keyboard model and Tab exits the composite widget. Plain semantic tables do not capture arrow keys for row navigation.

---

## 14. Animation & Motion

Motion is minimal and purposeful. No decorative animation.

| Interaction | Animation | Duration |
|---|---|---|
| Modal open | Fade in + scale from 0.96 to 1.0 | 150ms ease-out |
| Modal close | Fade out | 100ms ease-in |
| Drawer open | Slide in from right | 200ms ease-out |
| Drawer close | Slide out to right | 150ms ease-in |
| Toast appear | Slide in from right + fade in | 200ms |
| Tab switch | None — instant content change | — |
| Row hover | None — instant color change | — |
| Dropdown open | Fade in + 4px translate-y | 120ms ease-out |
| Skeleton pulse | Opacity 0.4 → 1.0 → 0.4 | 1.5s infinite |

**`prefers-reduced-motion`:** All animations disabled platform-wide. Transitions replaced with instant state changes. Implemented once in `style.css` — applies to all modules automatically:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 15. Accessibility Baseline

Every module must meet this baseline before platform integration. Requirements are non-negotiable and apply regardless of whether the module is internal-only.

- All form fields have explicit `<label>` associations — `for`/`id` pairing or `aria-labelledby`. Placeholder text is never the sole label.
- All icon-only buttons have `aria-label` describing the action (see §10.3).
- **Color is never the sole differentiator** — badges use text + color; table rows use icon + color; never color alone.
- Focus rings are visible on all interactive elements: `outline: 2px solid var(--color-focus); outline-offset: 2px`.
- Error states communicate through both color and icon + text — never color alone.
- Static status badges use ordinary semantic text and MUST NOT become live regions solely because they display status. When status changes dynamically, announce the change through an appropriate `role="status"`/live-region mechanism.
- Modals: `role="dialog"`, `aria-labelledby` pointing to modal heading, focus trapped inside, Escape closes and returns focus to trigger element.
- Toasts: success/info updates use `role="status"` or polite live announcements; urgent errors requiring immediate awareness may use `role="alert"`. Toasts do not steal focus.
- Drawers: `role="complementary"` or `role="dialog"` depending on content; focus managed per §13.
- Skeleton screens: `aria-busy="true"` on the container while loading; removed when content renders.
- All data tables: `<th scope="col">` on column headers; `<th scope="row">` on row headers where applicable.
- Platform conformance target: **WCAG 2.2 Level AA** for all supported user-facing and internal product surfaces.
- Normal text contrast MUST be at least 4.5:1; large text at least 3:1; meaningful non-text UI boundaries and states at least 3:1 against adjacent colors unless WCAG provides an exception.
- `--color-border` is intentionally subtle for decorative dividers/cards and MUST NOT be the sole visual boundary of an interactive control. Use `--color-control-border` for controls and `--color-focus` for focus indicators.
- `--color-brand` orange MUST NOT be used as normal-size text on light surfaces; use `--color-link`.
- Pointer targets SHOULD be at least 24×24 CSS px or satisfy the WCAG 2.2 spacing exception; primary controls SHOULD target 44×44 CSS px where density permits.
- Focus MUST not be fully obscured by sticky headers, drawers, cookie/notice bars, or other authored content.
- Dragging MUST have a non-drag alternative when dragging is required to complete an action.
- Authentication flows MUST not rely on cognitive-function tests such as memorization or transcription without an accessible alternative.
- At 200% text zoom and up to 400% browser zoom, content MUST remain operable without loss of information. Two-dimensional data structures may use controlled horizontal scrolling when essential.
- Windows High Contrast / `forced-colors` behavior MUST be tested for critical controls, focus indicators, selected states, and validation states.
- A skip link to `#main-content` MUST be the first keyboard-focusable element on every full-shell page.
- Heading levels MUST follow document hierarchy; visual styling MUST NOT determine semantic heading level.

---

## 16. Responsive Behavior

The platform is **desktop-first**, optimized for 1280px–1920px working environments, but accessibility support is not limited to those physical screen widths. Layouts MUST remain usable under browser zoom, text enlargement, split-screen use, and narrow CSS viewports.

| Effective CSS viewport | Required behavior |
|---|---|
| 1280px and wider | Full shell and intended multi-column layouts |
| 1100px–1279px | Left nav may collapse to 64px icon-only mode; main content fills remaining width |
| 768px–1099px | Side-by-side configuration/detail layouts stack or reduce columns; complex comparison views may switch to tabs |
| 320px–767px | Core content and actions remain operable in a linearized layout; data grids may use labeled horizontal scrolling when two-dimensional relationships are essential |

**Mobile product scope:** Dedicated mobile workflows, touch-optimized information architecture, and mobile-specific feature parity are not promised by v3.0. This does not permit inaccessible clipping or loss of controls at narrow effective viewports.

**Zoom/reflow:** Teams MUST test desktop pages at 200% and 400% browser zoom. Sticky elements MUST not obscure focused controls or prevent access to content.

**Touch:** Where pages are used on touch-capable laptops/tablets, controls MUST remain operable without hover. Hover-only information is prohibited.
---

## 17. Dark Mode & Theme Strategy

**Dark mode is not supported in v3.0.**

The platform shell (topbar and left nav) uses a dark surface (`--color-shell: #1A1D23`) as a deliberate brand choice — this is not dark mode. The main content area always renders on light surfaces (`--color-surface`, `--color-panel`).

Module teams must not implement dark mode independently. Any module that introduces a dark content area (other than the shell) is non-compliant. If dark mode becomes a platform requirement in a future version, it will be added to this framework as a complete token set and all modules will migrate simultaneously.

Until then: **if a module's CSS includes `prefers-color-scheme: dark` media queries affecting content areas, it must be removed before platform integration.**

---

## 18. Link & Anchor Styling

Text links in body copy, table cells, callouts, breadcrumbs, and other light-surface contexts MUST use `--color-link`, not `--color-brand`. The core orange is a brand fill and does not provide sufficient contrast for normal-size text on white/light surfaces.

| State | Color | Decoration |
|---|---|---|
| Default | `--color-link` | Underline for prose links; no underline for clearly styled action links |
| Hover | `--color-link` | Underline thickness increases or remains visible |
| Active (pressed) | `--color-link` | Underline |
| Visited | `--color-link` | Same as default unless product research establishes a need for visited differentiation |
| Focus | `--color-link` | 2px `--color-focus` outline, offset 2px; underline retained |

**Underline rule:** Links embedded inside sentences or paragraphs MUST be underlined by default so color is not the sole affordance. Links rendered as distinct UI actions (breadcrumbs, navigation, table action columns, buttons) MAY omit the default underline when their role is visually unambiguous; hover/focus states remain required.

**Links inside tables:** Use `--color-link`. Entity-name links may omit default underline when the entire column is consistently interactive; underline appears on hover and focus.

**External links:** Append a Phosphor `ArrowSquareOut` icon (16×16px) and provide accessible text that communicates external navigation when context requires it. Do not force a new tab by default. If a new tab is required by workflow, communicate that behavior in accessible text.

**Non-navigation actions:** MUST use a `<button>`, not an `<a href="#">`. Links navigate; buttons perform actions.
---

## 19. Print & Export Strategy

Insurance workflows frequently require printed or archived evidence. Print behavior is therefore part of the global baseline.

### Shared Print Baseline

The platform shared stylesheet MUST provide a minimal `@media print` layer that:
- hides topbar, left navigation, interactive-only controls, toasts, tooltips, and transient overlays;
- prints page title, record identity, visible status, relevant metadata, and primary content;
- uses black/dark text on white background and removes decorative shadows;
- expands scroll containers where technically practical so visible records are not clipped;
- preserves table headers on repeated pages where browser support allows;
- prints link destinations only when explicitly enabled by an export view; normal application printouts do not append raw URLs;
- avoids relying on color alone to communicate status or decisions.

### Dedicated Regulatory / Business Documents

Policies, certificates, invoices, bordereaux, audit evidence, reports, and other business documents MUST use a dedicated export/document template when layout fidelity is important. Browser print is not a substitute for a governed PDF/document generator.

### Export Contract

Module-level export features MUST define: output format, locale, timezone, currency, data cutoff timestamp, applied filters, generated-by identity where appropriate, confidentiality classification where applicable, and whether the output is point-in-time or live data.
---

## 20. Error & Validation Strategy

**Validation timing:** Required/business-rule validation MUST occur on submit or explicit progression. Inline validation MAY occur after a field has sufficient information and only when it improves the workflow. Do not produce disruptive errors while a user is still typing.

**Field-level:** Show a specific error adjacent to the relevant field with icon + `--color-danger` text. Associate it programmatically using `aria-describedby` or equivalent. Preserve the user's entered value.

**Form-level:** On failed submit, show an error summary at the top of the form or main content region and move keyboard focus to that summary. Each summary item links to the relevant field. Field error wording and summary wording MUST match. The page `<title>` SHOULD indicate that the page contains errors when the workflow reloads or re-renders a submitted form.

**Page-level:** Errors from API calls appear as an error toast only for transient/non-blocking failures. Blocking failures MUST also render persistent inline guidance at the point where work cannot continue.

**Destructive action confirmation:** All delete and retire actions require explicit confirmation when the result is destructive or difficult to reverse. Publish/approve actions require confirmation when they create a governed state transition. High-stakes actions MAY require typed confirmation when risk justifies the additional friction.

**Governance violations:** Show a permission-aware, context-specific message — never a generic error. Explain why the action is blocked and provide the correct next step.

> *"Published versions cannot be edited. Clone this version to make changes."* → with a [Clone Version] action button.

Never show "Error", "Invalid", "Forbidden", or "Not permitted" as the complete message. State what happened and how to recover.
---

## 21. Cross-Module Navigation Handoff

When one module links to a record or page in another module, the following rules apply. These ensure the shell, breadcrumb, and back-navigation behave predictably regardless of entry point.

### Breadcrumb on Cross-Module Entry

When a user arrives at Module B from a link in Module A, the breadcrumb reflects Module B's own hierarchy — not the path from Module A. The breadcrumb never shows cross-module ancestry.

**Correct:** `Product Studio › Product Catalogue › PRD-003`  
**Wrong:** `Governance › Approval Workflow › PRD-003 › Coverage Studio`

### Back Navigation

Cross-module links always open in the same tab. The browser's back button returns the user to the originating module page. There is no platform-managed "back to [Module A]" mechanism. If a module needs to surface a return path, it may show a Ghost button ("← Back to Approval Workflow") as a contextual action in the page header — not as a breadcrumb modification.

### Shell Context on Cross-Module Entry

The left nav highlights the active item in the destination module (Module B), regardless of where the user came from. The previously active Module A item does not remain highlighted.

### Deep Links

All module pages must be deep-linkable by URL. A URL shared directly must render the correct page with the correct shell context. Module pages must not require a specific navigation path to render correctly.

---

## 22. App Loading & Splash Behavior

The platform must not show a white flash or unstyled content on initial load. The following rules apply to the loading sequence:

### Shell Background on Load

The `<html>` or `<body>` element must carry `background-color: #1A1D23` (matching `--color-shell`) from the earliest possible paint. This prevents the white flash before the topbar and nav render.

```html
<html style="background-color: #1A1D23;">
```

### Font Loading

Inter and IBM Plex Mono must be declared with `font-display: swap` so text renders immediately in a system font and repaints when the custom fonts load — no invisible text during load.

### Content Area Loading

While module data is loading, the main content area shows skeleton screens (see §12 Loading States). The shell (topbar + nav) renders immediately and is never blocked by data loading.

### No Custom Splash Screen

The platform does not use a branded splash screen (full-screen logo animation, loading bar, etc.). The shell renders immediately; content loads progressively. Module teams must not add splash screens to their modules.

---

## 23. Browser Tab & Favicon Spec

### Favicon

The favicon uses the **vD monogram mark** — not the full wordmark. The monogram must be provided in the following formats:

| Format | Size | Usage |
|---|---|---|
| `favicon.ico` | 32×32px | Legacy browser support |
| `favicon-16.png` | 16×16px | Browser tab (small) |
| `favicon-32.png` | 32×32px | Browser tab (standard) |
| `apple-touch-icon.png` | 180×180px | iOS home screen bookmark |

The monogram mark on the favicon uses the orange gradient (`#F97316` → `#F59E0B`) on a `--color-shell` (`#1A1D23`) background, matching the topbar appearance.

### Browser Tab Title (`<title>`)

Every module page must follow this `<title>` pattern:

```
[Page Name] — [Module Name] | VeriDex
```

Examples:
- `Product Catalogue — Product Studio | VeriDex`
- `PRD-003 SME Property All Risks — Product Studio | VeriDex`
- `Approval Workflow — Governance | VeriDex`

Rules:
- The rightmost segment is always `VeriDex` — never `VeriDex Platform` or any other variant.
- The separator between page/module and brand is ` | ` (space-pipe-space).
- The separator between page name and module name is ` — ` (space-em-dash-space).
- Maximum title length: 60 characters (beyond this, browser tabs truncate). If the page name is long, truncate it — never truncate the `| VeriDex` segment.

---

## 24. Marketing-to-Product Handoff

The VeriDex marketing site (veridexsolutions.ai) links into the platform via CTAs such as "Talk to VeriDex" and "Explore Solutions." The handoff rules:

### Entry Point Behavior

Users arriving from the marketing site land on a defined entry URL. The entry URL always renders with the full platform shell (topbar + nav). No intermediate splash or marketing-branded loading screen appears.

### Shell on First Entry

First-time users land on the platform Dashboard (`/index.html`). The shell renders normally. Any onboarding nudges (e.g., "Welcome to VeriDex — here's where to start") are delivered via a Brand callout (§10.8, Brand type) at the top of the Dashboard content area — not as a modal interrupt.

### URL Handoff

Marketing CTAs must use clean platform URLs — never UTM-laden URLs as the visible destination. UTM parameters may be appended for analytics tracking but must not appear in the platform breadcrumb or `<title>`.

### Visual Continuity

The platform shell's dark topbar and orange brand color provide direct visual continuity with the marketing site's dark hero and orange brand. No additional transition design is needed.

---

## 25. Framework Versioning & Change Governance

This document is versioned. Changes are classified as breaking, additive, or corrective and follow a defined review process. Every released change MUST be traceable to a decision record, issue, pull request, or approved design review.

### Version Numbering

`[Major].[Minor].[Patch]`

Current document release: **3.0.0**. Header displays `3.0` for human readability; release tooling/changelog SHOULD use full semantic version.

- **Major version** (e.g., 3.0.0 → 4.0.0): Breaking changes — token renames, component API changes, shell restructuring, or any change that requires module teams to update their code.
- **Minor version** (e.g., 3.0.0 → 3.1.0): Non-breaking additions — new tokens, new components, new sections. Existing modules are unaffected but may optionally adopt new additions.

### Change Classification

| Change type | Classification | Process |
|---|---|---|
| Renaming or removing a CSS token | Breaking | Major version bump + migration guide |
| Changing a token's hex value | Breaking | Major version bump + migration guide |
| Adding a new token | Non-breaking | Minor version bump |
| Adding a new component | Non-breaking | Minor version bump |
| Updating component spec (size, padding, radius) | Breaking | Major version bump + migration guide |
| Adding a new section (e.g., new guidance area) | Non-breaking | Minor version bump |
| Correcting a typo or clarifying wording | Corrective | Patch version bump |

### Review Process

1. Any team may propose a change via a pull request or design review request to the Platform Design team.
2. The Platform Design team reviews within 5 business days and classifies the change.
3. Breaking changes require sign-off from at least two module teams before merging, to confirm migration feasibility.
4. On merge, the version number in this document's header is updated, a changelog entry is added, and all module teams are notified through the designated platform design/release channel.

### Exceptions

A module may deviate from this framework only with documented approval from the Platform Design team. The exception must be recorded in the module's own README with the rationale, the approving person, and the date. Exceptions are reviewed at each major version increment and either absorbed into the framework or formally retired.

### Migration Guides

Every major version increment ships with a migration guide listing every breaking change and the exact code update required. Module teams have a migration window defined in the migration guide. The Platform Design & Architecture owners may set a standard target (for example 30 days), but critical accessibility, security, or regulatory fixes may require faster adoption.

### Deprecation Policy

Deprecated tokens/components remain supported for at least one minor release unless an urgent security/accessibility defect requires immediate removal. Deprecation notices MUST identify replacement, removal version, migration example, and owner.

### Changelog Requirement

Every release records: date, version, change summary, classification, affected tokens/components/patterns, migration action, and owner. Major releases include a complete migration guide.


### v3.0 Migration Summary

v3.0 is a breaking release because it changes accessibility-critical color tokens and interaction requirements. Module teams migrating from v2.x MUST at minimum:
- replace normal-text uses of `--color-brand` with `--color-link`;
- use `--color-on-brand` for text/icons on orange fills and `--color-link` border for orange controls on light surfaces;
- use `--color-control-border` for interactive boundaries and `--color-focus` for focus indicators;
- adopt updated draft/retired and functional semantic token values;
- remove blanket optimistic completion for governed/high-impact actions;
- implement WCAG 2.2 AA release checks, zoom/reflow, semantic landmarks, and skip link;
- adopt locale-aware formatting and internationalization-safe layout rules;
- add shared print baseline and security/privacy UX checks.

---

## 26. Shared Asset Architecture

The platform provides a set of shared assets that all modules import. No module reimplements anything in this set.

```
/platform/
  /assets/
    style.css          ← Design tokens (:root block) + all component styles
    nav.js             ← Shell rendering: topbar, left nav, nav registry API
    components.js      ← Component renderers: badges, tables, modals, drawers, toasts, etc.
    data.js            ← Platform-level reference data: users, roles, channels, products
  /modules/
    [module-slug]/
      index.html       ← Module entry point / dashboard
      *.html           ← Additional module pages
      module.js        ← Module-specific logic
      module-data.js   ← Module-specific dummy/seed data (if needed)
```

Each module page imports `style.css`, `nav.js`, `components.js`, and `data.js` from the platform assets path. Module-specific JS is inline in a `<script>` tag or in the module's `module.js`. Navigation between pages uses standard `<a href>` links — no routing library required.

---

## 27. Dummy Data Conventions

All prototype and demo data must be seeded consistently across modules so that cross-module workflows are coherent. Module teams must use these platform-level entities wherever they appear — do not invent alternative users, channels, or product anchors.

### Platform Products

| ID | Name | Status |
|---|---|---|
| `PRD-001` | Private Car Comprehensive | Published (v2026.04) |
| `PRD-002` | Private Car Third Party Only | Draft |
| `PRD-003` | SME Property All Risks | In Review |
| `PRD-004` | Group Health — Corporate Plan | Approved |
| `PRD-005` | Marine Cargo Open Cover | Superseded |
| `PRD-006` | Travel Worldwide Annual | Retired |

### Platform Users

Use for all ownership, approval, and audit trail fields across every module:

- `Anika Sharma` — Product Manager
- `Rajan Mehta` — Pricing Actuary
- `Sunita Pillai` — Underwriting Manager
- `David Okonkwo` — Compliance Officer
- `Priya Varghese` — Publisher / Release Manager
- `Marcus Lee` — Administrator

### Platform Channels

Use wherever distribution channel references are needed:

- `CHAN-D01` — Direct (Web)
- `CHAN-B01` — Broker Portal
- `CHAN-BA01` — Bancassurance
- `CHAN-API01` — API Partner

### Conventions

- **ID format:** `[PREFIX]-[3-digit number]` — e.g., `PRD-001`, `RUL-042`, `CHAN-B01`
- **Prototype seed date display:** `DD-Mon-YYYY` — e.g., `14-Apr-2026`. Production UI MUST use locale-aware formatting defined in §34.
- **Prototype seed currency:** `USD`. Production UI MUST never assume USD; currency comes from record/tenant/context and follows §34.

Module teams define their own entity data (rules, versions, configurations, etc.) but must use the platform-level products, users, and channels wherever those entities are referenced.

---

## 28. Module Onboarding Checklist

Before a new module is merged into the platform, the module team confirms all of the following. This checklist is the gate — a module that cannot check every item is not ready for integration.

**Tokens & Brand**
- [ ] All color values consumed from CSS tokens — zero hard-coded hex values in module CSS
- [ ] Primary action button uses `--color-brand` orange with `--color-on-brand` foreground (6px radius) — no legacy blue, no white foreground, no 4px primary
- [ ] No `prefers-color-scheme: dark` media queries affecting content areas

**Shell & Navigation**
- [ ] Shell (topbar + left nav) rendered from platform `nav.js` — not rebuilt in the module
- [ ] Module nav group registered via `VeriDexNav.registerModule()` with valid Phosphor icon names
- [ ] Nav active state renders correctly (3px `--color-brand` left border + `--color-brand-light` tint)
- [ ] No platform-reserved nav icon reused

**Components**
- [ ] All component types (badges, tables, buttons, modals, toasts) sourced from `components.js`
- [ ] Status badges use platform status token set only — no substitute ambers or yellows for review
- [ ] Form fields comply with §10.5 spec (label, focus ring, error state, disabled state, placeholder rule)
- [ ] Icon-only buttons all have `aria-label`

**Z-Index**
- [ ] All z-index values use `--z-*` tokens — no hard-coded integers

**Interactions**
- [ ] Dirty state warning fires on nav click, browser back, tab close, and browser close
- [ ] Optimistic UI limited to low-risk reversible actions; governed/high-impact actions await server confirmation
- [ ] Governance-sensitive fields are read-only in inline context
- [ ] Loading: skeleton screens for page load, button spinner for action load

**Focus Management**
- [ ] Modal open: focus moves into modal; modal close: focus returns to trigger
- [ ] Drawer open: focus moves into drawer; drawer close: focus returns to trigger
- [ ] Destructive action (row delete): focus moves to next logical element

**Density & Responsive**
- [ ] Density toggle functional (comfortable + compact, localStorage persisted, no reload)
- [ ] Layout follows §16 effective-viewport behavior and remains operable through 400% zoom

**Accessibility**
- [ ] All form fields have explicit `<label>` associations
- [ ] Color is never the sole state differentiator
- [ ] Focus rings visible (`outline: 2px solid var(--color-focus); outline-offset: 2px`)
- [ ] Modals: `role="dialog"`, `aria-labelledby`, focus trap, Escape-to-close
- [ ] Toast semantics match urgency: polite/status for routine updates; alert only for urgent errors
- [ ] Skeleton screens: `aria-busy="true"` while loading

**Content & Navigation**
- [ ] Page title follows `[Page Name] — [Module Name] | VeriDex` pattern
- [ ] Page header follows §9 pattern
- [ ] All entity IDs rendered in IBM Plex Mono
- [ ] Empty states follow §10.10 pattern with action-oriented copy
- [ ] All module pages are deep-linkable by URL
- [ ] Cross-module links do not modify breadcrumb ancestry
- [ ] Dummy data uses platform-level products, users, and channels

**Loading**
- [ ] `<html>` background set to `#1A1D23` to prevent white flash
- [ ] No splash screen or full-screen loading animation

**Global Standards**
- [ ] WCAG 2.2 AA target verified for module-specific implementation
- [ ] Prose links use `--color-link`; orange brand token not used as normal-size text on light surfaces
- [ ] Skip link and semantic landmarks present; one page-level `<h1>`
- [ ] Critical workflow completes with keyboard only
- [ ] Page remains operable at 200% and 400% browser zoom
- [ ] No hover-only or drag-only critical interaction
- [ ] Locale-aware dates, numbers, currencies, and timezone-sensitive timestamps implemented
- [ ] Unicode content and long-label expansion tested
- [ ] CSS logical properties used for directional layout; RTL smoke test completed where applicable
- [ ] Supported browser matrix smoke-tested
- [ ] Sensitive data excluded from URL, browser title, analytics labels, and end-user diagnostics
- [ ] Print/export requirements evaluated for business evidence workflows


---

## 29. Standards & Compliance Baseline

This framework adopts external standards rather than inventing competing accessibility or interaction semantics.

### Required Baseline

- **Accessibility:** WCAG 2.2 Level AA is the platform conformance target.
- **Accessible widget behavior:** Native HTML first; when custom widgets are necessary, behavior and semantics MUST align with WAI-ARIA Authoring Practices patterns relevant to that widget.
- **Web platform:** Use standards-based HTML, CSS, and JavaScript. Progressive enhancement is preferred for critical data-entry and navigation flows.
- **Localization:** Unicode/UTF-8, locale-aware formatting, language metadata, logical CSS properties, and bidirectional-content safety are required.
- **Security/privacy:** UI must follow organization security/privacy policies and must never expose sensitive values purely for convenience.

### Native First Rule

Use native `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`, `<table>`, `<dialog>` (where support/behavior is validated), and semantic landmarks before recreating equivalent behavior with generic elements and ARIA. ARIA supplements semantics; it does not replace correct HTML.

### Compliance Ownership

Shared components are tested by Platform Design & Architecture. Module teams remain responsible for page-level accessibility and cannot assume that using shared components automatically makes a page compliant.

---

## 30. Semantic HTML & ARIA Contract

### Page Landmarks

Every full-shell page MUST provide:
- one `<main id="main-content">` landmark;
- identifiable primary navigation (`<nav aria-label="Primary">` or equivalent);
- topbar/header landmark where appropriate;
- search landmark when global search is present;
- no duplicate unlabeled landmarks of the same type.

### Headings

Each page MUST have one clear page-level `<h1>`. Sections nest sequentially based on document structure. Do not skip heading levels merely to obtain visual size; typography classes control appearance.

### Interactive Semantics

- Navigation uses links; operations use buttons.
- Disabled controls use native `disabled` when available. `aria-disabled="true"` alone does not prevent interaction and requires explicit behavior.
- Custom controls MUST expose accessible name, role, state, value, keyboard behavior, focus behavior, and error/help relationships.
- IDs referenced by `aria-labelledby`, `aria-describedby`, `aria-controls`, and similar properties MUST exist and be unique.
- Do not add redundant or invalid ARIA to native elements.

### Composite Widgets

Tabs, comboboxes, listboxes, menus, grids, tree views, toolbars, and radio groups MUST follow one documented keyboard model. Module teams MUST NOT invent alternative arrow-key behavior for the same shared component type.

### Live Regions

Use live regions sparingly:
- `role="status"` / polite announcements for non-urgent state updates;
- `role="alert"` for urgent errors that require immediate awareness;
- do not announce every keystroke, filter update, or autosave event.

### Tables vs Interactive Grids

Use semantic `<table>` for reading/tabular data. Use ARIA `grid`/`treegrid` only when cells themselves require application-like keyboard interaction. A sortable/filterable table does not automatically require `role="grid"`.

---

## 31. Internationalization, Localization & RTL

The platform is internationalization-ready even when a deployment currently serves one locale.

### Language & Encoding

- All documents use UTF-8.
- `<html lang="…">` MUST reflect current UI language.
- Language changes inside content SHOULD use `lang` on the relevant fragment when pronunciation matters.
- User-entered names and text MUST support Unicode; validation MUST NOT assume ASCII-only names, addresses, or punctuation unless the business rule genuinely requires it.

### RTL Support

Shared shell, layout primitives, and components MUST be **RTL-capable** in v3.0. Individual modules are not considered RTL-certified until tested with real Arabic/Hebrew content.

Implementation rules:
- use CSS logical properties (`margin-inline`, `padding-inline`, `inset-inline-start`, `border-inline-start`) instead of hard-coded left/right when direction matters;
- set `dir="rtl"` at document/root level for RTL locales;
- use `dir="auto"` for unknown-direction user-generated text where appropriate;
- do not mirror logos, media playback controls, charts whose axes have semantic direction, or universally directional symbols without design review;
- directional icons such as back/forward arrows MUST mirror with UI direction when they represent navigation.

### Text Expansion

Shared components MUST tolerate at least ~30% label expansion without truncating critical actions. Do not size buttons to English strings. Truncation may be used for long record values only when full content is available via an accessible mechanism.

### Translation Safety

Do not concatenate sentence fragments to build UI messages. Use complete translatable strings with placeholders. Do not embed user-visible text inside images or SVG paths.

---

## 32. Browser, Viewport & Input Support

### Browser Support Contract

Production support targets the latest two stable major versions of:
- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Apple Safari on macOS

Enterprise deployments may certify additional versions by contract. Unsupported-browser handling MUST never silently break critical workflows; show a clear compatibility message when a known unsupported environment blocks operation.

### Input Methods

Every core workflow MUST work with:
- keyboard only;
- pointer/mouse;
- touch where browser/device exposes touch input;
- screen-reader virtual navigation for semantic content.

No critical action may depend only on hover, drag, double-click, right-click, or fine-pointer precision.

### Viewport & Zoom Test Matrix

Minimum release checks:
- 1280×720 CSS px baseline;
- 1440×900 and 1920×1080 desktop references;
- 200% browser zoom;
- 400% browser zoom / narrow effective CSS viewport;
- system text scaling where supported;
- high-contrast / forced-colors mode on Windows for critical workflows.

### Orientation

The desktop web product does not promise dedicated portrait-mobile layouts, but content MUST not require a specific device orientation to access core actions unless the workflow makes orientation essential.

---

## 33. Content, Microcopy & Naming

### UI Language

- Use plain, domain-correct language.
- Prefer verbs for actions: `Publish version`, `Add coverage`, `Download report`.
- Avoid internal implementation terminology unless the user persona genuinely works with it.
- One concept has one platform name. Module teams MUST NOT rename shared concepts locally without governance approval.

### Buttons

Button labels describe the resulting action, not generic intent. Prefer `Save changes` over `Submit`, `Create product` over `OK`. `Cancel` is acceptable when it clearly exits without applying changes.

### Confirmation & Success

Success messages name completed action and relevant object when helpful. Confirmation text states consequence before destructive or governed transitions.

### Dates, Numbers & Acronyms in Copy

Do not manually bake locale-sensitive number/date formats into prose generated by UI code. Expand uncommon acronyms on first use in user-facing explanatory content or provide glossary/help access.

### Empty States

Distinguish:
- true empty state (nothing created yet);
- zero search/filter results;
- permission-limited state;
- loading state;
- error state.

These states MUST NOT reuse the same message or illustration when user action differs.

---

## 34. Data Presentation & Locale Formatting

### Source Values vs Display Values

Stored/API values remain canonical. UI formatting is a presentation concern and MUST NOT alter source precision, identifiers, or timezone semantics.

### Dates & Times

- Display dates/times using active locale and explicit timezone context.
- When time can affect business interpretation, show or make discoverable the timezone (for example `27-Aug-2026 14:30 CDT`).
- Relative time (`3 hours ago`) MAY supplement but MUST NOT replace an exact timestamp in audit, governance, financial, or legal contexts.
- Date input components MUST accept/present formats appropriate to locale while transmitting a canonical machine-readable value.

### Numbers

Use locale-aware decimal and thousands separators. Do not parse numbers by stripping punctuation without locale context.

### Currency

Currency is data, not a global UI default. Show ISO currency code when ambiguity exists or when multiple currencies can appear together. Never infer currency solely from user locale.

### Percentages & Rates

Define whether displayed values are percentages, basis points, decimals, rates per unit, or currency-per-exposure. Precision and rounding MUST follow business rules, not component defaults.

### Identifiers

Entity IDs, policy numbers, claim numbers, version IDs, and other machine identifiers MUST preserve exact characters and leading zeros. Do not localize or reformat identifiers.

### Large Data Tables

For wide/large data sets:
- preserve header association;
- provide visible sorting/filter state;
- expose active filter count and a clear-all mechanism;
- keep pagination/virtualization behavior understandable to assistive technology;
- do not hide critical columns solely to fit viewport; use responsive prioritization or horizontal scrolling with context.

---

## 35. Security, Privacy & Session UX

### Sensitive Data

Sensitive values (credentials, tokens, bank details, government identifiers, health/claim details, or other protected data) MUST follow field-level masking and permission rules defined by security/privacy policy. UI convenience does not override least-privilege principles.

### Copy to Clipboard

Copy actions for sensitive values MUST be explicit, permission-aware, and produce a non-disruptive confirmation. Do not place secrets in DOM/tooltips if user lacks permission to reveal them.

### Authentication & Session Expiry

- Warn users before an authenticated session expires when technically possible and policy permits.
- If unsaved changes exist, session-expiry UX SHOULD provide a compliant way to preserve/recover work where security policy permits.
- After re-authentication, return users to intended context when safe; do not silently repeat destructive actions.
- Never show raw access tokens, refresh tokens, stack traces, or internal authorization claims in end-user error messages.

### Authorization

Do not rely on hidden/disabled controls as security enforcement. Server-side authorization remains authoritative. UI may hide unavailable actions to reduce noise, but permission denials must remain secure and explainable.

### Privacy

Analytics/telemetry MUST avoid sensitive payloads unless expressly approved. Do not include sensitive field values in URLs, browser titles, analytics event names, client logs, or toast text.

---

## 36. Quality Gates, Testing & Release Evidence

A framework becomes a source of truth only when compliance is testable.

### Required Release Evidence

Every new shared component or materially changed component MUST provide:
- design specification and states;
- token usage;
- semantic HTML/ARIA contract;
- keyboard interaction table;
- focus behavior;
- responsive/reflow behavior;
- localization/RTL notes;
- loading, empty, error, disabled, read-only, and permission states where applicable;
- automated tests where practical;
- manual accessibility test record.

### Module Integration Gate

Before release, module teams MUST verify:
1. no unauthorized hard-coded colors, spacing, z-indexes, or duplicate shared components;
2. WCAG 2.2 AA checks for page-specific implementation;
3. keyboard-only completion of critical workflows;
4. visible focus and correct focus return;
5. 200% and 400% zoom/reflow checks;
6. screen-reader smoke test of critical flows using at least one supported desktop screen reader/browser pairing;
7. locale test with long text and non-ASCII content;
8. RTL smoke test for shared-layout regressions when module is marked RTL-capable;
9. supported-browser smoke test;
10. error, loading, empty, permission-denied, and session-expiry states;
11. print/export behavior when workflow handles printable business evidence;
12. no sensitive data leakage into URL/title/client-visible diagnostics.

### Automation

Recommended CI checks include linting for hard-coded token values, accessibility rules, invalid ARIA, duplicate IDs, color contrast where statically testable, and component visual regression. Automated tooling does not replace manual keyboard, screen-reader, zoom, and workflow testing.

### Ownership

Platform Design & Architecture owns framework compliance rules and shared components. Module teams own page composition and business-flow compliance. Security, privacy, legal, and accessibility specialists retain authority over their respective mandatory controls.

---

### External Standards References

Normative external references used by this framework:
- W3C Web Content Accessibility Guidelines (WCAG) 2.2
- W3C WAI-ARIA Authoring Practices Guide (APG)
- W3C Internationalization guidance for language and bidirectional text

*End of VeriDex Platform Global UI/UX Framework v3.0. All module-level READMEs reference this document and do not repeat global specs. Proposed additions or exceptions must be reviewed by Platform Design & Architecture before implementation.*
