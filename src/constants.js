import * as dotenv from 'dotenv';
dotenv.config();

const { OPENAI_API_KEY, SUPABASE_PUBLIC_KEY, SUPABASE_PRIVATE_KEY, SUPABASE_URL } = process.env;

export { OPENAI_API_KEY, SUPABASE_PUBLIC_KEY, SUPABASE_PRIVATE_KEY, SUPABASE_URL };
