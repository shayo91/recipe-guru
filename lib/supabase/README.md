# Supabase Client Setup

This directory contains Supabase client utilities for both server and client-side usage.

## Files

- **`client.ts`** - Browser/client-side Supabase client
- **`server.ts`** - Server-side Supabase client (for Server Components and API routes)
- **`middleware.ts`** - Middleware helper for session management
- **`auth.ts`** - Authentication helper functions

## Usage

### Server Components

```typescript
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from("recipes").select("*");
  // ...
}
```

### Client Components

```typescript
"use client";

import { createClient } from "@/lib/supabase/client";

export default function Component() {
  const supabase = createClient();
  // ...
}
```

### Authentication Helpers

```typescript
import { getCurrentUser, getCurrentUserProfile } from "@/lib/supabase/auth";

// In a Server Component
const user = await getCurrentUser();
const profile = await getCurrentUserProfile();
```

## Environment Variables

Make sure you have set up your `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

