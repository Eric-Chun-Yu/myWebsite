import { createClient } from '@supabase/supabase-js'

// ⚠️ 請從 Supabase 網站首頁點「Settings → API」複製你的 URL 和 Key
const supabaseUrl = 'https://bowxwkqgbexdemwchhtc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvd3h3a3FnYmV4ZGVtd2NoaHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTM1OTQsImV4cCI6MjA2MDE4OTU5NH0.ROlPQJqlhqnWACOz9eH-pNG9o0j_rOVWgbA8zy1qO0c'
export const supabase = createClient(supabaseUrl, supabaseKey)