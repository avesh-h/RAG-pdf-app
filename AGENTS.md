# AGENTS.md - RAG PDF Client

## Project Overview

This is a Next.js 16 application (App Router) using React 19 for a RAG (Retrieval-Augmented Generation) PDF chatbot. It uses the Vercel AI SDK for streaming chat, shadcn/ui (radix-nova style) for components, Tailwind CSS v4, and stores vector embeddings in Neon PostgreSQL.

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

### Database (Prisma)
```bash
npx prisma generate     # Regenerate Prisma client after schema changes
npx prisma db push     # Push schema to database
npx prisma studio      # Open GUI to browse database
```

Note: There are no dedicated test commands. The project does not currently have a test suite set up.

---

## Code Style Guidelines

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Page components | `page.js` or `page.jsx` | `src/app/page.js` |
| Layout components | `layout.js` | `src/app/layout.js` |
| API routes | `route.js` | `src/app/api/chat/route.js` |
| Server Actions | `actions.js` | `src/app/upload/actions.js` |
| UI components | `kebab-case.jsx` | `src/components/ui/button.jsx` |
| Hooks | `camel-case.js` | `src/hooks/use-mobile.js` |
| Utilities | `kebab-case.js` | `src/lib/utils.js` |
| Client components | `"use client"` directive at top | `src/app/chat/page.jsx` |

### Import Conventions

```javascript
// 1. React (always import when using JSX)
import * as React from "react"

// 2. Third-party libraries
import { cn } from "clsx"
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
import { cn } from "@/lib/utils"
```

### Formatting Rules

1. **No semicolons** at end of statements
2. **Double quotes** for strings
3. **Arrow functions** for components when concise
4. **Template literals** for string interpolation
5. **Destructuring** for component props
6. **Default parameters** for optional props

### API Route Patterns

```javascript
// src/app/api/chat/route.js
import { sql } from "@/lib/db-config"
import { generateEmbedding } from "@/lib/embeddings"
import { openai } from "@ai-sdk/openai"

export async function POST(req) {
  try {
    const { messages } = await req.json()
    const queryEmbedding = await generateEmbedding(messages[messages.length - 1].content)

    const results = await sql`
      SELECT content, 1 - (embedding <=> ${queryEmbedding}::vector) as similarity
      FROM "Document"
      ORDER BY embedding <=> ${queryEmbedding}::vector
      LIMIT 5
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: `Context: ${results.map(r => r.content).join("\n")}` }, ...messages],
    })

    return Response.json({ message: response.choices[0].message })
  } catch (error) {
    console.error("Chat error:", error)
    return Response.json({ error: "Chat failed" }, { status: 500 })
  }
}
```

### Server Actions

```javascript
// src/app/upload/actions.js
"use server"

import { sql } from "@/lib/db-config"
import { extractTextFromPDF } from "@/lib/pdf"
import { chunkText } from "@/lib/chunking"
import { generateEmbeddings } from "@/lib/embeddings"

export async function processPdfFile(formData) {
  try {
    const file = formData.get("pdf")
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const text = await extractTextFromPDF(buffer)
    const chunks = chunkText(text)
    const embeddings = await generateEmbeddings(chunks)

    for (let i = 0; i < chunks.length; i++) {
      await sql`
        INSERT INTO "Document" (content, embedding)
        VALUES (${chunks[i]}, ${embeddings[i]})
      `
    }

    return { success: true, chunksCreated: chunks.length }
  } catch (error) {
    console.error("Upload error:", error)
    return { success: false, error: error.message }
  }
}
```

### Error Handling

- Use try/catch blocks for async operations
- Log errors with `console.error()` including context
- Return appropriate HTTP status codes
- Return JSON error responses with consistent `{ success, error }` structure

### Database Connection

```javascript
// src/lib/db-config.js
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

export { sql }
```

### Utility Functions

Use the `cn()` utility from `@/lib/utils` for merging Tailwind classes:
```javascript
import { cn } from "@/lib/utils"

className={cn("base-class", conditional && "conditional-class", className)}
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/
│   │   └── chat/route.js  # Chat API endpoint (RAG query)
│   ├── chat/page.jsx      # Chat page
│   ├── upload/
│   │   └── actions.js     # Server action for PDF upload
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles + design system
├── components/
│   ├── ai-elements/      # AI chat UI components
│   └── ui/               # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── db-config.js      # Neon database connection
│   ├── embeddings.js    # OpenAI embedding generation
│   ├── pdf.js          # PDF text extraction
│   ├── chunking.js     # Text chunking
│   └── utils.js        # Utility functions (cn helper)
├── generated/prisma/    # Generated Prisma client
└── prisma/
    └── schema.prisma    # Database schema
```

---

## Database Schema

```prisma
// prisma/schema.prisma
model Document {
  id        Int      @id @default(autoincrement())
  content   String
  embedding Unsupported("vector(1536)")
}
```

Vector index (create manually in Neon SQL editor):
```sql
CREATE INDEX IF NOT EXISTS embeddingIndex ON "Document" USING hnsw (embedding vector_cosine_ops);
```

---

## Key Dependencies

- **Framework**: Next.js 16.2.4 (App Router)
- **UI**: React 19.2.4
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **Database**: Neon PostgreSQL + @neondatabase/serverless
- **Components**: shadcn/ui, Radix UI primitives, Base UI
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`)
- **PDF**: pdfjs-dist
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge, class-variance-authority

---

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

---

## Adding shadcn/ui Components

```bash
npx shadcn@latest add component-name
```

Configuration in `components.json`:
- Style: `radix-nova`
- RSC: enabled (`tsx: false`, using JSX)
- Icon library: `lucide`
- CSS variables: enabled