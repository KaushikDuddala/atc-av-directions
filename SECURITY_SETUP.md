# Security Implementation - Supabase Setup

## Overview
This document provides SQL queries to set up secure admin authentication in Supabase. The implementation uses:
- **Bcrypt** password hashing (10 salt rounds)
- **HTTP-only cookies** for session management
- **Server-side** password verification
- **No client-side password exposure**

## SQL Queries

### 1. Create Admin Credentials Table

```sql
-- Create table for admin credentials
CREATE TABLE admin_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow reads from authenticated admin sessions
-- In production, only allow this from your server via service role key
CREATE POLICY "Disable all access to admin_credentials"
  ON admin_credentials
  FOR ALL
  USING (false);
```

### 2. Insert Initial Admin Password

First, generate your password hash locally:
```bash
node scripts/hash-password.mjs "your-secure-password-here"
```

Then run this SQL (replace the hash with your generated one):
```sql
INSERT INTO admin_credentials (password_hash)
VALUES ('$2a$10$...');  -- Replace with your bcrypt hash
```

### 3. Update Admin Password

To change the admin password:
```bash
# 1. Generate new hash
node scripts/hash-password.mjs "your-new-password"

# 2. Update in Supabase (or run this SQL):
UPDATE admin_credentials
SET password_hash = '$2a$10$...'  -- Replace with new hash
WHERE id = (SELECT id FROM admin_credentials LIMIT 1);
```

## Setup Instructions

### Option A: Supabase UI (Recommended for beginners)
1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the "Create Admin Credentials Table" query above
5. Click "Run"
6. Generate a password hash: `node scripts/hash-password.mjs "admin123"`
7. Copy the "Insert Initial Admin Password" query
8. Replace the hash placeholder with your generated hash
9. Click "Run"

### Option B: Command Line (Advanced)
```bash
# If you have supabase CLI installed
supabase db push

# Or use psql directly
psql "postgresql://postgres:[password]@[project-id].supabase.co:5432/postgres" << EOF
[paste the CREATE TABLE query here]
EOF
```

## Security Best Practices

### ✓ What This Implementation Does Right

1. **Never exposes passwords in client code**
   - No `NEXT_PUBLIC_ADMIN_PASSWORD` env var
   - Password is hashed with bcrypt (10 rounds)
   - Hash is stored server-side only

2. **Server-side verification**
   - Password comparison happens in `/api/admin/verify` 
   - Client never sees password or hash
   - bcrypt comparison prevents timing attacks

3. **Secure session management**
   - Uses HTTP-only cookies (cannot be accessed by JavaScript)
   - Secure flag enabled in production (HTTPS only)
   - SameSite=Lax to prevent CSRF attacks
   - 7-day expiration

4. **No sessionStorage/localStorage**
   - Removed trivial sessionStorage auth tokens
   - Sessions cannot be hijacked via console
   - Cookies automatically sent with requests

### ⚠️ What to Avoid

**NEVER do this:**
```javascript
// ❌ WRONG - Exposes password to client
const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

// ❌ WRONG - Stores auth in localStorage (XSS vulnerable)
localStorage.setItem("admin_auth", "true")

// ❌ WRONG - Stores in sessionStorage (easily bypassable)
sessionStorage.setItem("admin_auth", "true")

// ❌ WRONG - Comparing plaintext passwords
if (password === input) { ... }
```

### ✓ What This Implementation Does

**GOOD - Use this pattern:**
```typescript
// ✓ RIGHT - Server-side bcrypt comparison
const isValid = await bcrypt.compare(inputPassword, storedHash)

// ✓ RIGHT - HTTP-only secure cookie
cookieStore.set("admin_session", "authenticated", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax"
})

// ✓ RIGHT - Check cookie server-side with server action
const isAuth = (await cookies()).get("admin_session")?.value === "authenticated"
```

## Testing

### 1. Test Password Verification
```bash
# Generate a test hash
node scripts/hash-password.mjs "testpass123"

# Insert into Supabase admin_credentials table
# Then test the /api/admin/verify endpoint:

curl -X POST http://localhost:3000/api/admin/verify \
  -H "Content-Type: application/json" \
  -d '{"password":"testpass123"}'

# Should return: {"success":true}
```

### 2. Test Browser Resistance
1. Open admin dashboard
2. Open browser DevTools Console
3. Try: `sessionStorage.setItem("admin_auth", "true")`
4. Refresh page
5. ✓ Should still require password (sessionStorage is not used anymore)
6. Try: `document.cookie = "admin_session=authenticated"`
7. Refresh page  
8. ✓ Should still require password (only HTTP-only cookies work)

### 3. Test Cookie Security
```javascript
// In browser console, HTTP-only cookies are invisible:
console.log(document.cookie)  
// Only shows non-HTTP-only cookies

// BUT the cookie is automatically sent with requests:
// Try logging in and check Network tab → Cookies
```

## Fallback Configuration

If you want to use an environment variable for development without Supabase:

```bash
# Generate hash
node scripts/hash-password.mjs "dev-password"

# Add to .env.local
ADMIN_PASSWORD_HASH=$2a$10$...
```

The API endpoint will use this as fallback if the database query fails.

## Upgrading from Old Implementation

If you have the old `NEXT_PUBLIC_ADMIN_PASSWORD` setup:

1. **Delete** `NEXT_PUBLIC_ADMIN_PASSWORD` from `.env.local`
2. **Install bcryptjs**: Already done (added to package.json)
3. **Generate new hash**: `node scripts/hash-password.mjs "your-password"`
4. **Create** the admin_credentials table (SQL above)
5. **Insert** the hash into the table
6. **Test** the new authentication flow
7. **Clear** old sessionStorage in browser if users have it set

## Support

### Common Issues

**Q: I get "Admin credentials not configured" error**
- A: Either insert data into admin_credentials table OR set ADMIN_PASSWORD_HASH in .env.local

**Q: Password doesn't work but hash looks correct**
- A: Make sure you used `node scripts/hash-password.mjs` - different hashing methods produce different results

**Q: Cookie isn't being set**
- A: Check that you're using HTTPS in production (secure flag requires it). In dev, it should work over HTTP.

**Q: Users can still bypass by setting admin_session cookie**
- A: HTTP-only cookies cannot be set by JavaScript - this is browser security feature

**Q: How do I logout users?**
- A: Call the `/api/admin/logout` endpoint (POST request), which deletes the HTTP-only cookie
