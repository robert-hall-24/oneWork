// Client/hooks/useUser.ts
import { supabase } from '../lib/supabase.ts';

export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
}