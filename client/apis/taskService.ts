import { supabase } from '../lib/supabase';

// 🆕 Create a task
export async function createTask(userId: string, name: string, description: string) {
  const { data, error } = await supabase.from('task').insert([
    {
      user_id: userId,
      name,
      description,
      created_at: new Date().toISOString()
    }
  ]);

  if (error) throw new Error(error.message);
  return data;
}

// 📦 Fetch tasks for a user
export async function fetchTasks(userId: string) {
  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// 👤 Get current user’s profile (from your `user` table)
export async function fetchUserProfile() {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) return null;

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
