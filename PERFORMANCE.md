# Performance Optimizations

A detailed breakdown of every performance optimization applied to the frontend, with the actual code that makes each one work.

---

## Table of Contents

1. [3D Scene Reduction](#1-3d-scene-reduction)
2. [Lazy + Idle Canvas Loading](#2-lazy--idle-canvas-loading)
3. [GPU Capability Detection](#3-gpu-capability-detection)
4. [Canvas Render Settings](#4-canvas-render-settings)
5. [StarField Device-Adaptive Particle Counts](#5-starfield-device-adaptive-particle-counts)
6. [Zustand Store Cleanup](#6-zustand-store-cleanup)
7. [React.memo on Card Components](#7-reactmemo-on-card-components)
8. [useMemo on Derived Lists](#8-usememo-on-derived-lists)
9. [useCallback on Event Handlers](#9-usecallback-on-event-handlers)
10. [Route-Level Code Splitting](#10-route-level-code-splitting)
11. [Build Output & Chunk Strategy](#11-build-output--chunk-strategy)

---

## 1. 3D Scene Reduction

**Problem:** The app originally shipped 11 separate Three.js scene files (HeroScene, AboutScene, SkillsScene, WorkScene, CareerScene, BlogScene, BooksScene, ContactEarthScene, Effects, NebulaCloud, CosmicLights). Each scene contained complex geometries, postprocessing shaders, and materials — all loaded upfront regardless of whether the user scrolled to that section.

**Solution:** Removed every scene file except `StarField.tsx`, which provides the ambient parallax star background. This eliminates hundreds of draw calls, shader compilations, and geometry allocations.

**Files deleted:**

```
src/components/3d/scenes/HeroScene.tsx
src/components/3d/scenes/AboutScene.tsx
src/components/3d/scenes/SkillsScene.tsx
src/components/3d/scenes/WorkScene.tsx
src/components/3d/scenes/CareerScene.tsx
src/components/3d/scenes/BlogScene.tsx
src/components/3d/scenes/BooksScene.tsx
src/components/3d/scenes/ContactEarthScene.tsx
src/components/3d/postprocessing/Effects.tsx
src/components/3d/shared/NebulaCloud.tsx
src/components/3d/shared/CosmicLights.tsx
```

**Packages removed:** `@react-three/postprocessing`, `postprocessing`

**Impact:** ~800KB less JavaScript parsed on the GPU path. No more postprocessing passes (Bloom, ChromaticAberration, DepthOfField) running every frame.

---

## 2. Lazy + Idle Canvas Loading

**Problem:** The Three.js canvas and all its dependencies (three, @react-three/fiber, @react-three/drei, maath) were bundled into the main chunk and parsed during initial page load, blocking first paint.

**Solution:** A `GlobalCanvasLoader` component defers loading the entire 3D canvas until the browser is idle, using `requestIdleCallback` with a 3-second timeout fallback.

**File:** `src/components/layout/GlobalCanvasLoader.tsx`

```tsx
import React, { lazy, memo, Suspense, useEffect, useState } from "react";

const GlobalCanvas = lazy(() =>
  import("../3d/GlobalCanvas").then((m) => ({ default: m.GlobalCanvas })),
);

export const GlobalCanvasLoader = memo(function GlobalCanvasLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), {
        timeout: 3000,
      });
      return () => window.cancelIdleCallback(id);
    }
    // Fallback for Safari
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <GlobalCanvas />
    </Suspense>
  );
});
```

**How it works:**

1. `React.lazy()` tells Vite to split `GlobalCanvas` (and all its Three.js imports) into a separate chunk.
2. `requestIdleCallback` waits until the main thread is idle before setting `ready = true`. This means the HTML, CSS, text content, and navigation all render first.
3. The `timeout: 3000` ensures the canvas loads within 3 seconds even on busy pages.
4. Safari doesn't support `requestIdleCallback`, so it falls back to a 100ms `setTimeout`.
5. `Suspense fallback={null}` means no flash of loading UI — the stars fade in once the chunk loads.

**Usage in App.tsx:**

```tsx
import { GlobalCanvasLoader } from "./components/layout/GlobalCanvasLoader";

// Inside the component tree:
<ErrorBoundary fallback={null}>
  <GlobalCanvasLoader />
</ErrorBoundary>;
```

The `ErrorBoundary` with `fallback={null}` ensures any WebGL crash silently hides the canvas instead of breaking the page.

**Impact:** The main bundle (`index-*.js`) no longer includes Three.js. The canvas loads as a separate ~807KB chunk only after the page is interactive.

---

## 3. GPU Capability Detection

**Problem:** Low-end devices, mobile phones, and machines without WebGL would still attempt to initialize a Three.js canvas, wasting resources or crashing.

**Solution:** `GlobalCanvas` runs a capability check on mount and completely bails out if the device can't handle it.

**File:** `src/components/3d/GlobalCanvas.tsx`

```tsx
export const GlobalCanvas = memo(function GlobalCanvas() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Skip on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setVisible(false);
      return;
    }
    // Skip on low-core devices
    if (
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency <= 2
    ) {
      setVisible(false);
      return;
    }
    // Skip if no WebGL support
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) setVisible(false);
    } catch {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;
  // ... render Canvas
});
```

**Three gates checked:**

| Check                                | Why                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `window.innerWidth < 768`            | Mobile screens don't benefit from a background star field — saves battery |
| `navigator.hardwareConcurrency <= 2` | Dual-core CPUs can't spare a thread for WebGL without jank                |
| WebGL context creation               | If the GPU driver doesn't support WebGL at all, don't even try            |

If any check fails, the component returns `null` — zero GPU overhead.

---

## 4. Canvas Render Settings

**Problem:** Default Three.js canvas settings enable expensive features (antialiasing, depth testing, stencil buffer, high DPR) that aren't needed for a simple star field.

**Solution:** Every setting is tuned for the minimal star particle use case.

```tsx
const dpr = useMemo(() => {
  if (typeof window === "undefined") return 1;
  return Math.min(1.5, window.devicePixelRatio);
}, []);

<Canvas
  gl={{
    alpha: true, // Transparent background (stars over page content)
    antialias: false, // Points don't need edge smoothing
    powerPreference: "high-performance", // Request discrete GPU if available
    stencil: false, // No stencil operations needed
    depth: false, // 2D star points — no depth sorting
  }}
  dpr={dpr} // Capped at 1.5x (not 2x or 3x)
  frameloop="always" // Stars rotate continuously via useFrame
/>;
```

**Why each setting matters:**

| Setting     | Default            | Our Value       | Savings                                                    |
| ----------- | ------------------ | --------------- | ---------------------------------------------------------- |
| `antialias` | `true`             | `false`         | Avoids MSAA — cuts fragment shader cost ~2-4x              |
| `stencil`   | `true`             | `false`         | Smaller framebuffer                                        |
| `depth`     | `true`             | `false`         | Skips depth buffer allocation + depth testing per fragment |
| `dpr`       | `devicePixelRatio` | `min(1.5, dpr)` | On 3x screens, renders 56% fewer pixels                    |

---

## 5. StarField Device-Adaptive Particle Counts

**Problem:** Rendering 4,000 particles on a budget laptop causes frame drops.

**Solution:** Particle counts adapt based on device capability, and all position buffers are memoized to avoid re-allocation.

**File:** `src/components/3d/shared/StarField.tsx`

```tsx
export const StarField = memo(function StarField() {
  // Detect device capability once
  const { farCount, midCount, nearCount } = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const isLowEnd =
      typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
    const reduce = isMobile || isLowEnd;
    return {
      farCount: reduce ? 800 : 3000,
      midCount: reduce ? 200 : 800,
      nearCount: reduce ? 60 : 200,
    };
  }, []);

  // Position buffers — computed once, never reallocated
  const farPositions = useMemo(
    () => random.inSphere(new Float32Array(farCount * 3), { radius: 80 }),
    [farCount],
  );
  const midPositions = useMemo(
    () => random.inSphere(new Float32Array(midCount * 3), { radius: 40 }),
    [midCount],
  );
  const nearPositions = useMemo(
    () => random.inSphere(new Float32Array(nearCount * 3), { radius: 20 }),
    [nearCount],
  );

  // Animation — lightweight rotation + size twinkle
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (farRef.current) farRef.current.rotation.y = t * 0.02;
    if (midRef.current) midRef.current.rotation.y = t * 0.04;
    if (nearRef.current) {
      nearRef.current.rotation.y = t * 0.08;
      const mat = nearRef.current.material as THREE.PointsMaterial;
      mat.size = 0.25 + 0.1 * Math.sin(t * 2);
    }
  });

  // ...renders three <Points> layers
});
```

**Particle budget:**

| Layer                | Desktop   | Low-end / Mobile |
| -------------------- | --------- | ---------------- |
| Far (slow, small)    | 3,000     | 800              |
| Mid (moderate)       | 800       | 200              |
| Near (fast, twinkle) | 200       | 60               |
| **Total**            | **4,000** | **1,060**        |

The `useMemo` on position `Float32Array` buffers ensures the random sphere calculation runs exactly once. Without it, every re-render would allocate and fill a new typed array.

The entire component is wrapped in `memo()` so it never re-renders unless its (empty) props change — which is never.

---

## 6. Zustand Store Cleanup

**Problem:** The `sceneStore` held state for the deleted 3D scenes (`hoveredSkill`, `activeCareerNode`, `isLoaded`, and their setters). These caused unnecessary subscriber notifications.

**Solution:** Stripped the store to only the state that's still used (section tracking for scroll position).

**File:** `src/store/sceneStore.ts`

```tsx
import { create } from "zustand";

interface SceneState {
  activeSection: SectionId;
  previousSection: SectionId | null;
  activeProjectIndex: number;

  setActiveSection: (id: SectionId) => void;
  setActiveProjectIndex: (index: number) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  activeSection: "hero",
  previousSection: null,
  activeProjectIndex: 0,

  setActiveSection: (id) =>
    set({ activeSection: id, previousSection: get().activeSection }),
  setActiveProjectIndex: (index) => set({ activeProjectIndex: index }),
}));
```

**Removed fields:** `hoveredSkill`, `activeCareerNode`, `isLoaded`, `setHoveredSkill`, `setActiveCareerNode`, `setIsLoaded`

**Impact:** Fewer Zustand subscriptions fire, and the store's memory footprint is smaller.

---

## 7. React.memo on Card Components

**Problem:** Card components (BlogCard, GuestbookCard, ProjectGridCard, etc.) are rendered inside lists. When the parent re-renders (e.g., infinite scroll fetches new data), every existing card re-renders even though its props haven't changed.

**Solution:** Wrap each card in `React.memo()` to skip re-renders when props are referentially equal.

**Components wrapped:**

### BlogCard

```tsx
export const BlogCard: React.FC<BlogCardProps> = React.memo(
  ({ post, index }) => {
    // ...render logic
  },
);
BlogCard.displayName = "BlogCard";
```

### GuestbookCard

```tsx
export const GuestbookCard: React.FC<GuestbookCardProps> = React.memo(
  ({ entry, index }) => {
    // ...render logic
  },
);
GuestbookCard.displayName = "GuestbookCard";
```

### ProjectGridCard

```tsx
export const ProjectGridCard: React.FC<ProjectCardProps> = React.memo(
  ({ project }) => {
    // ...render logic
  },
);
ProjectGridCard.displayName = "ProjectGridCard";
```

### Other memoized components:

- **NextPostCard** — `React.memo(function NextPostCard(...))`
- **CommentItem** — `React.memo(CommentItemInner)` (recursive component, the inner function references the memoized export for child replies)
- **PolaroidCard** — `React.memo(function PolaroidCard(...))`

`displayName` is set so React DevTools shows the component name instead of "Anonymous".

**Impact:** In a list of 20 guestbook entries, when new entries load from infinite scroll, the existing 20 cards skip their render entirely — React compares props, sees they're unchanged, and bails out.

---

## 8. useMemo on Derived Lists

**Problem:** Derived lists (flatMapping paginated data, filtering posts) run on every render even when their input hasn't changed.

**Solution:** Wrap expensive derivations in `useMemo`.

### Guestbook — flattening paginated data

```tsx
// Before: runs flatMap on every render
const allEntries = data?.pages.flatMap((p) => p.data) ?? [];

// After: only recalculates when `data` changes
const allEntries = useMemo(
  () => data?.pages.flatMap((p) => p.data) ?? [],
  [data],
);
```

### Blog — filtering by category (already optimized)

```tsx
const allPosts: BlogPostData[] = useMemo(() => {
  const raw = Array.isArray(data) ? data : (data?.data ?? data?.blogs ?? []);
  return raw.map((post) => ({
    /* normalize */
  }));
}, [data]);

const filteredPosts = useMemo(() => {
  if (!activeCategory) return allPosts;
  return allPosts.filter((p) => p.category === activeCategory);
}, [activeCategory, allPosts]);
```

### Projects — filtering by tag (already optimized)

```tsx
const allTags = useMemo(
  () => Array.from(new Set(allProjects.flatMap((p) => p.tags))).sort(),
  [allProjects],
);

const filtered = useMemo(() => {
  if (activeFilter === "all") return allProjects;
  return allProjects.filter((p) => p.tags.includes(activeFilter));
}, [activeFilter, allProjects]);
```

**Impact:** When the Guestbook page re-renders (e.g., the infinite scroll sentinel triggers), `allEntries` isn't recalculated unless new pages arrive. Combined with the memoized `GuestbookCard`, this means scrolling is nearly free.

---

## 9. useCallback on Event Handlers

**Problem:** Inline arrow functions create a new function reference on every render. When passed as props to memoized children, this defeats `React.memo` because the prop is "different" every time.

**Solution:** Wrap stable handlers in `useCallback`.

### ShareBar

```tsx
export default function ShareBar({ title, slug }: ShareBarProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const openInNewTab = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  // ...buttons use these stable references
}
```

### Blog Page — category change & load more

```tsx
const handleCategoryChange = useCallback(
  (cat: string) => {
    setVisibleCount(POSTS_PER_PAGE);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  },
  [setSearchParams],
);

const handleLoadMore = useCallback(() => {
  setVisibleCount((prev) => prev + POSTS_PER_PAGE);
}, []);
```

Both have empty or minimal dependency arrays, so they're created once and never change. If these were passed to memoized child components, the children would correctly skip re-renders.

---

## 10. Route-Level Code Splitting

All non-home routes are lazy-loaded with `React.lazy`:

```tsx
const BlogPage = React.lazy(() =>
  import("./pages/Blog").then((m) => ({ default: m.BlogPage })),
);
const BlogDetailPage = React.lazy(() =>
  import("./pages/BlogDetail").then((m) => ({ default: m.BlogDetailPage })),
);
const BooksPage = React.lazy(() =>
  import("./pages/Books").then((m) => ({ default: m.BooksPage })),
);
const ContactPage = React.lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.ContactPage })),
);
const ProjectsPage = React.lazy(() =>
  import("./pages/Projects").then((m) => ({ default: m.ProjectsPage })),
);
const GuestbookPage = React.lazy(() =>
  import("./pages/Guestbook").then((m) => ({ default: m.GuestbookPage })),
);
// ...and more
```

Each page becomes its own chunk. Users visiting the homepage never download the Blog, Contact, or Guestbook JavaScript.

---

## 11. Build Output & Chunk Strategy

After all optimizations, the production build splits into focused chunks:

| Chunk               | Size (min)  | Size (gzip) | What's in it                                                |
| ------------------- | ----------- | ----------- | ----------------------------------------------------------- |
| `index-*.js`        | 620 KB      | 210 KB      | React, Router, TanStack Query, Framer Motion, home sections |
| `GlobalCanvas-*.js` | 807 KB      | 218 KB      | Three.js, R3F, drei, StarField (loaded via idle callback)   |
| `schemas-*.js`      | 87 KB       | 26 KB       | JSON-LD structured data schemas                             |
| `BlogDetail-*.js`   | 19 KB       | 6 KB        | Blog post page                                              |
| `Blog-*.js`         | 9 KB        | 3 KB        | Blog listing page                                           |
| `Contact-*.js`      | 10 KB       | 4 KB        | Contact form page                                           |
| `Projects-*.js`     | 4 KB        | 2 KB        | Projects listing page                                       |
| `Guestbook-*.js`    | 5 KB        | 2 KB        | Guestbook page                                              |
| Other pages         | 3–8 KB each | 1–3 KB each | Books, Legal, GuestbookCreate                               |

**Key insight:** The Three.js chunk (807 KB) never blocks first paint. It loads after the page is interactive via `requestIdleCallback`. A user on a slow connection sees the full page content before any 3D code is even requested.

---

## Summary

| Optimization            | Technique                                          | Where                           |
| ----------------------- | -------------------------------------------------- | ------------------------------- |
| Remove unused 3D scenes | Delete files, uninstall packages                   | 11 scene files removed          |
| Defer canvas loading    | `React.lazy` + `requestIdleCallback`               | `GlobalCanvasLoader.tsx`        |
| Skip weak devices       | `hardwareConcurrency`, viewport width, WebGL probe | `GlobalCanvas.tsx`              |
| Reduce GPU work         | Disable antialias, depth, stencil; cap DPR at 1.5  | `GlobalCanvas.tsx`              |
| Adaptive particles      | Device-aware counts via `useMemo`                  | `StarField.tsx`                 |
| Trim state              | Remove dead Zustand fields                         | `sceneStore.ts`                 |
| Prevent card re-renders | `React.memo` on 6 card components                  | BlogCard, GuestbookCard, etc.   |
| Cache derived data      | `useMemo` on flatMap / filter                      | Guestbook, Blog, Projects pages |
| Stabilize handlers      | `useCallback`                                      | ShareBar, Blog filters          |
| Code-split routes       | `React.lazy` per page                              | App.tsx                         |
