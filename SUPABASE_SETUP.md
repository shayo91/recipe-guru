# Supabase Setup Guide

This guide will walk you through setting up Supabase in your Recipe Guru project.

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your **recipe-guru** project
3. Navigate to **Project Settings** → **API**
4. You'll find two important values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (a long string starting with `eyJ...`)

## Step 2: Create Environment Variables File

1. In your project root, create a file named `.env.local`
2. Copy the template from `.env.local.example` or create it with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the placeholder values with your actual Supabase credentials

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://mbzonfvnspgqpdqhzpsm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Verify Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. The middleware will automatically handle session management
3. You can now use Supabase in your components!

## Step 4: Test the Connection

You can test the setup by creating a simple test component or API route:

```typescript
// app/test/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("recipes").select("*").limit(1);
  
  return (
    <div>
      <h1>Supabase Connection Test</h1>
      {error ? (
        <p>Error: {error.message}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
```

## File Structure

```
lib/
  supabase/
    client.ts      # Browser/client-side client
    server.ts      # Server-side client
    middleware.ts  # Session management
    auth.ts        # Auth helper functions
    README.md      # Usage documentation

middleware.ts      # Next.js middleware for auth
.env.local         # Your environment variables (not committed)
```

## Security Notes

- ✅ The `anon` key is safe to expose in client-side code
- ✅ Row Level Security (RLS) policies protect your data
- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use server-side client for sensitive operations

## Next Steps

Now that Supabase is set up, you can:

1. Create authentication pages (sign in, sign up)
2. Build recipe CRUD operations
3. Implement user profiles
4. Add recipe browsing and search

Check `lib/supabase/README.md` for usage examples!

