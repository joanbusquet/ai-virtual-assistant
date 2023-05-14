import * as Constants from '../src/constants.js';
import { createClient } from '@supabase/supabase-js';
// Creamos el cliente de la base de datos vectorial de Supabase
const supabaseClient = createClient(Constants.SUPABASE_URL, Constants.SUPABASE_PRIVATE_KEY);

export { supabaseClient };
