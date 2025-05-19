---
applyTo: '**/*.tsx,**/*.ts'
---

## Next.js App Directory Directives

- You MUST always add the correct directive at the top of each file:
  - Use `'use client';` for files that use client-only features (e.g., React hooks, browser APIs).
  - Use `'use server';` for files that should run only on the server.
- If a file is a React component that uses hooks or browser APIs, always add `'use client';` as the first line.
- If unsure, prefer explicit directives to avoid runtime errors.
