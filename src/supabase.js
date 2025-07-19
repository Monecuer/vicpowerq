
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jthfoegozryaishmbsge.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aGZvZWdvenJ5YWlzaG1ic2dlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjg3NTk3NCwiZXhwIjoyMDY4NDUxOTc0fQ.uDRSlexG9olGfiiBrpv80zFZRed8Tx6jXt1SQtZeQEA'; // shorten here for safety

export const supabase = createClient(supabaseUrl, supabaseKey);
