# AGENTS.md - RAG PDF Client

## Project Overview

This is a Next.js 16 application (App Router) using React 19 for a RAG (Retrieval-Augmented Generation) PDF chatbot. It uses the Vercel AI SDK for streaming chat, shadcn/ui (radix-nova style) for components, and Tailwind CSS v4 for styling.

---

## Build/Lint/Test Commands

### Development
```bash
npm run dev          # Start development server at http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint on the codebase
```

Note: There are no dedicated test commands. The project does not currently have a test suite set up. If adding tests, use Vitest or Jest with `@testing-library/react`.

### Code Quality
- ESLint configuration: `eslint.config.mjs` (flat config format)
- Uses `eslint-config-next/core-web-vitals` rules
- React Compiler (Babel plugin) is enabled in `next.config.mjs` (`reactCompiler: true`)

---

## Code Style Guidelines

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Page components | `page.js` or `page.jsx` | `src/app/page.js` |
| Layout components | `layout.js` | `src/app/layout.js` |
| API routes | `route.js` | `src/app/api/chat/route.js` |
| UI components | `kebab-case.jsx` | `src/components/ui/button.jsx` |
| Hooks | `camel-case.js` | `src/hooks/use-mobile.js` |
| Utilities | `kebab-case.js` | `src/lib/utils.js` |
| Client components | `"use client"` directive at top | `src/app/chat/page.jsx` |

### Component Structure

Use named exports for UI components:
```javascript
// Named export with kebab naming
function Button({ className, variant = "default", size = "default", ...props }) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants }
```

### Import Conventions

```javascript
// 1. React (always import when using JSX)
import * as React from "react"

// 2. Third-party libraries
import { cn } from "clsx";
import { twMerge } from "tailwind-merge"

// 3. Radix UI primitives
import { Dialog as DialogPrimitive } from "radix-ui"

// 4. Internal components (use @ alias)
import { Button } from "@/components/ui/button"

// 5. Internal utilities
import { cn } from "@/lib/utils"

// 6. Internal hooks
import { useIsMobile } from "@/hooks/use-mobile"

// 7. Next.js imports
import Image from "next/image"
```

### Path Aliases

The project uses `@/` as an alias for `./src/`:
```javascript
// All of these resolve to the same location:
import { cn } from "@/lib/utils"
import { cn } from "src/lib/utils"
```

### Formatting Rules

1. **No semicolons** at end of statements
2. **Double quotes** for strings
3. **Arrow functions** for components when concise
4. **Template literals** for string interpolation
5. **Destructuring** for component props
6. **Default parameters** for optional props

```javascript
// Good
function Card({ className, size = "default", ...props }) {
  return <div data-slot="card" className={cn("base-class", className)} {...props} />;
}

// Good - boolean props default to false
function DialogContent({ className, children, showCloseButton = true, ...props }) {
  return showCloseButton && <button />;
}
```

### Data Slot Pattern

All UI components use `data-slot` attributes for styling targeting:
```javascript
function Card({ className, ...props }) {
  return <div data-slot="card" className={cn("...", className)} {...props} />;
}
```

### API Route Patterns

```javascript
// src/app/api/chat/route.js
import { streamText, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";

export const POST = async (req) => {
  try {
    const { messages } = await req.json();
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
```

### Error Handling

- Use try/catch blocks for async operations
- Log errors with `console.error()` including context
- Return appropriate HTTP status codes
- Return JSON error responses with consistent structure

```javascript
try {
  const data = await fetchData();
  return Response.json(data);
} catch (error) {
  console.error("Failed to fetch data:", error);
  return Response.json({ error: "Failed to fetch data" }, { status: 500 });
}
```

### CSS/Tailwind Conventions

1. Use CSS custom properties (variables) from design system
2. Use `cn()` utility for conditional classes
3. Use dark mode classes: `dark:` prefix
4. Use Tailwind v4 features (custom variants, `@theme`)

```javascript
// Using design system colors
className="bg-primary text-primary-foreground"

// Dark mode
className="dark:bg-background dark:text-foreground"

// Conditional classes
className={cn(
  "base-classes",
  isActive && "active-class",
  className
)}
```

### Design System Colors

Available via Tailwind (defined in `globals.css`):
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive`
- `--border`, `--input`, `--ring`
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`

### Client Components

Use `"use client"` directive for interactive components:
```javascript
"use client";

import React, { useState } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  // ...
}
```

### State Management

- Use React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
- AI SDK's `useChat` hook for chat functionality
- No external state management library (Zustand/Redux) currently used

### Utility Functions

Use the `cn()` utility from `@/lib/utils` for merging Tailwind classes:
```javascript
import { cn } from "@/lib/utils";

className={cn("base-class", conditional && "conditional-class", className)}
```

---

## Adding New Components

When adding shadcn/ui components, use the CLI:
```bash
npx shadcn@latest add component-name
```

The `components.json` configuration specifies:
- Style: `radix-nova`
- RSC: enabled (`tsx: false`, using JSX)
- Icon library: `lucide`
- CSS variables: enabled
- Aliases configured for `@/components`, `@/lib`, `@/hooks`

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── chat/route.js  # Chat API endpoint
│   ├── chat/page.jsx      # Chat page
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles + design system
├── components/
│   └── ui/                # shadcn/ui components
├── hooks/                  # Custom React hooks
│   └── use-mobile.js      # Mobile detection hook
└── lib/
    └── utils.js           # Utility functions (cn helper)
```

---

## Key Dependencies

- **Framework**: Next.js 16.2.4 (App Router)
- **UI**: React 19.2.4
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **Components**: shadcn/ui, Radix UI primitives, Base UI
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority
