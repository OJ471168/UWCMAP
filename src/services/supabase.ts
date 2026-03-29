import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vlrbeemaxxdqiczdxomd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscmJlZW1heHhkcWljemR4b21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzkxNDYsImV4cCI6MjA4NDE1NTE0Nn0.TVPeCb9pudVV2_OsjSeNU6fGCVOVxSx6mYUfZPg0QB0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
