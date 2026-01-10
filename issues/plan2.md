# Code Quality Audit Report: `/apps/website`

## Executive Summary

This Next.js codebase has **significant technical debt** requiring immediate attention. Key findings:

- **14 files exceed 200 lines** (2 over 600 lines)
- **90% code duplication** across focus-cards components
- **60% duplication** across 4 pathway pages
- **68+ hardcoded image URLs** scattered throughout
- **Multiple console.log statements** in production code
- **State management abuse** - filters stored in useState instead of URL params

---

# 🚨 TECHNICAL DEBT DISASTERS

## 1. THE 645-LINE MONSTER: `who-we-are/page.tsx`

**Path:** `src/app/(marketing)/who-we-are/page.tsx`
**Lines:** 645

This is the worst offender. It's a "kitchen sink" file doing everything:

- 8 hardcoded testimonials (lines 75-111)
- 7 hardcoded card objects (lines 19-73)
- 4 WobbleCard pathway sections rendered TWICE
- Multiple CTA sections duplicated
- 40+ lines of commented-out dead code (lines 601-641)
- **Unused imports:** `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `ProfileCard`

**Why it's a disaster:** Any change requires navigating 645 lines. Testimonials/cards are buried in JSX. Same pathway content appears twice with different styling.

---

## 2. FOCUS CARDS COPY-PASTE NIGHTMARE

**90% identical code across 3 files:**

- `src/components/ui/focus-cards.tsx`
- `src/components/ui/focus-cards-many.tsx`
- `src/components/ui/focus-cards-text.tsx`

Only differences: grid columns (`3` vs `8` vs `4`), gap spacing, whether to show description.

**Lines 8-50 are virtually identical** in all three. This should be ONE component with props:

```tsx
<FocusCards cols={3} gap={10} showDescription={false} />
```

---

## 3. PATHWAY PAGES: 4 FILES, 60% DUPLICATE

**Affected files:**
| File | Lines |
|------|-------|
| `pathways/network/page.tsx` | 404 |
| `pathways/cohorts/page.tsx` | 377 |
| `pathways/research/page.tsx` | 293 |
| `pathways/partnerships/page.tsx` | 287 |

**All 4 share identical structure:**

- Animated title header with colored underline
- Hero section with description
- "What makes us different" sections with repeated checkmark SVGs
- FAQ sections (identical markup)
- CTA buttons (same styling)

The same checkmark SVG is repeated **12+ times** across these files.

---

## 4. INLINE SVG BLOAT: `animated-beam-multiple-outputs.tsx`

**Path:** `src/components/animated-beam-multiple-outputs.tsx`
**Lines:** 479 (360 lines are SVG definitions!)

Contains 6 full SVG icon definitions inline:

- OpenAI icon
- Google Drive icon
- Google Docs icon
- WhatsApp icon
- Messenger icon
- Notion icon

**The actual component logic is only ~120 lines.** The rest is icon definitions that should be in a separate `icons/` directory.

---

## 5. HARDCODED URL CHAOS

### Airtable Form URL (appears 6 times)

```
https://airtable.com/appPR9mkslbn3U8YZ/shrHHUtRzK4DqKt3F
```

**Found in:**

- `components/header.tsx` (lines 38, 83, 126)
- `components/apply.tsx` (line 22)
- `_sections/take-action.tsx` (line 44)
- `who-we-are/page.tsx` (commented, line 590)

### Donation URL (appears 2 times)

```
https://collect.crowded.me/collection/8d1ba838-a38e-4803-b155-d102b7b131e4
```

**Found in:** `components/header.tsx` (lines 70, 141)

### Image URLs from UFS.sh (68+ occurrences)

Same image URLs repeated across multiple files. Example:

```
https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToOaVg3qCIBDGmcbISEzQYZx81iL0rWJ43h2T9d
```

Appears 4+ times across:

- `lib/constants/projects.tsx`
- `lib/projects.ts`
- `who-we-are/page.tsx`
- Multiple pathway pages

---

## 6. CONSOLE.LOG IN PRODUCTION

| File                          | Line       | Statement            |
| ----------------------------- | ---------- | -------------------- |
| `api/newsletter/route.ts`     | 36, 62, 81 | `console.error(...)` |
| `api/contact/route.ts`        | 53         | `console.error(...)` |
| `careers/page.tsx`            | 13         | `console.error(...)` |
| `careers/[slug]/page.tsx`     | 91         | `console.error(...)` |
| `blog/[slug]/LinkPreview.tsx` | 64         | `console.error(...)` |
| `lib/blog/content.tsx`        | 40         | `console.warn(...)`  |

---

## 7. STATE MANAGEMENT ABUSE

### URL Params Stored as useState (HIGH PRIORITY)

**`src/components/careers/CareersList.tsx`:**

```tsx
const [selectedCategory, setSelectedCategory] = useState<CareerCategory>("all");
const [searchQuery, setSearchQuery] = useState("");
```

**Problems:**

- Can't bookmark filtered views
- Browser back button doesn't work
- State lost on refresh
- Not SEO-friendly

**`src/app/(marketing)/blog/BlogSearch.tsx`:**

```tsx
const [searchText, setSearchText] = useState("");
const [results, setResults] = useState<SearchResult[]>([]);
```

`results` is derived state that should be computed with `useMemo`, not stored.

---

## 8. ABANDONED CODE & MERGE ARTIFACTS

### Commented-Out Blocks

- `who-we-are/page.tsx`: 40+ lines of dead code (lines 601-641)
- `project/page.tsx`: Commented anchor links and buttons
- `pathways/page.tsx`: Commented link blocks

### Merge Conflict Markers Still Present

```tsx
{
  /* --- Start of resolved conflict block --- */
}
{
  /* --- End of resolved conflict block --- */
}
```

Found in:

- `pathways/partnerships/page.tsx` (lines 27, 38, 52, 106, 113)
- `pathways/page.tsx` (line 94)

---

## 9. FORM VALIDATION DUPLICATION

Same email validation regex in 2 files:

```tsx
/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
```

- `contact-us/page.tsx` (line 122)
- `download-brochure.tsx` (line 122)

Error rendering JSX pattern repeated 8+ times in `contact-us/page.tsx` alone.

---

# 📋 REFACTORING PRIORITIES

## Priority 1: Critical (Fix This Week)

| Task                                            | Impact                                    | Effort |
| ----------------------------------------------- | ----------------------------------------- | ------ |
| Create `PathwayTemplate.tsx` component          | Eliminates 60% duplication across 4 files | Medium |
| Consolidate 3 focus-cards into 1 component      | Eliminates 90% duplication                | Low    |
| Extract hardcoded URLs to `.env`                | Prevents deployment issues                | Low    |
| Move filter state to URL params (`CareersList`) | Fixes UX bugs                             | Medium |

## Priority 2: High (Fix This Sprint)

| Task                                  | Impact                               | Effort |
| ------------------------------------- | ------------------------------------ | ------ |
| Decompose `who-we-are/page.tsx`       | Maintainability                      | High   |
| Extract icons to `components/icons/`  | Reduces `animated-beam` by 360 lines | Low    |
| Create reusable `FormField` component | Reduces contact form complexity      | Medium |
| Remove console.log statements         | Production hygiene                   | Low    |
| Delete commented-out code blocks      | Code clarity                         | Low    |

## Priority 3: Medium (Next Sprint)

| Task                                     | Impact                 | Effort |
| ---------------------------------------- | ---------------------- | ------ |
| Extract testimonials/cards to data files | Separation of concerns | Low    |
| Create `useApi` hook for fetch patterns  | Reduces boilerplate    | Medium |
| Standardize modal state management       | Consistency            | Medium |
| Extract validation utilities             | Reusability            | Low    |
| Remove unused imports                    | Bundle size            | Low    |

---

# 📊 FILE SIZE LEADERBOARD (Shame List)

| Rank | File                                 | Lines | Verdict              |
| ---- | ------------------------------------ | ----- | -------------------- |
| 1    | `who-we-are/page.tsx`                | 645   | 🔥 CRITICAL          |
| 2    | `animated-beam-multiple-outputs.tsx` | 479   | 🔥 CRITICAL          |
| 3    | `pathways/network/page.tsx`          | 404   | ⚠️ HIGH              |
| 4    | `pathways/cohorts/page.tsx`          | 377   | ⚠️ HIGH              |
| 5    | `contact-us/page.tsx`                | 355   | ⚠️ HIGH              |
| 6    | `lib/projects.ts`                    | 354   | ℹ️ Data file (OK)    |
| 7    | `careers/CareersList.tsx`            | 319   | ⚠️ MEDIUM            |
| 8    | `_sections/hero.tsx`                 | 303   | ⚠️ MEDIUM            |
| 9    | `blog/[slug]/page.tsx`               | 299   | ℹ️ Dynamic page (OK) |
| 10   | `pathways/research/page.tsx`         | 293   | ⚠️ HIGH              |

---

# ✅ VERIFICATION CHECKLIST

After refactoring, verify:

1. **Run build:** `pnpn run build -F @amaxa/website` - no TypeScript errors
2. **Run lint:** `pnpm run lint -F @amaxa/website` - no ESLint warnings
3. **Manual test pages:**
   - `/who-we-are` renders correctly
   - All 4 `/pathways/*` pages work
   - `/careers` filtering works with URL params
   - `/contact-us` form submits
4. **Check bundle size:** Ensure no regression after extracting components
5. **Test bookmarkable URLs:** `/careers?category=internship` should work

---

# Summary Stats

- **Files >200 lines:** 14
- **Duplicate code identified:** ~2,000+ lines could be eliminated
- **Hardcoded URLs:** 76+
- **Console statements:** 8
- **Unused imports:** 4+
- **Commented code blocks:** 6 major sections
