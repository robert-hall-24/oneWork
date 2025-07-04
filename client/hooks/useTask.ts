import { useEffect, useState } from 'react';
import { fetchUserProfile, fetchTasks } from '../apis/taskService';

export function useTask() {
  const [task, setTask] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const user = await fetchUserProfile();
        if (!user) throw new Error('No user logged in');

        const userTask = await fetchTasks(user.id);
        setTask(userTask || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, []);

  return { task, loading, error };
}
