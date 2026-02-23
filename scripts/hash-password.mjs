#!/usr/bin/env node
/**
 * Generate a bcrypt hash for your admin password
 * Run: node scripts/hash-password.mjs "your-password-here"
 */

import bcrypt from "bcryptjs"

const password = process.argv[2]

if (!password) {
  console.error("Please provide a password: node scripts/hash-password.mjs 'your-password'")
  process.exit(1)
}

const salt = await bcrypt.genSalt(10)
const hash = await bcrypt.hash(password, salt)

console.log("\n✓ Password hash generated successfully")
console.log("\nAdd this to your .env.local or Supabase admin_credentials table:")
console.log(hash)
console.log("\n")
