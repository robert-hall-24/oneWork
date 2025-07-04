import { useState, useEffect } from 'react';
import { useFruits } from '../hooks/useFruits.ts';
import { useTask } from '../hooks/useTask.ts';
import { supabase } from '../lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { User } from '@supabase/auth-js';

function App() {
  const { data: fruits } = useFruits();
  const { task, loading, error } = useTask();

  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false); // ✅ new state to prevent flicker

  // ✅ Check auth on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthChecked(true); // ✅ moved inside .then
    });
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthChecked(true); // ✅ also set true here for fallback
    });
  
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (!authChecked) return <p>Loading authentication...</p>; // ✅ prevents Auth remounting too early

  return (
    <div className="app bg-yellow-100 p-4">
      <h1 className="text-3xl font-bold underline mb-4">
        Fullstack Boilerplate - with Fruits!
      </h1>

      <h2 className="text-xl font-semibold">Fruits</h2>
      <ul className="list-disc list-inside mb-6">
        {fruits && fruits.map((fruit) => <li key={fruit}>{fruit}</li>)}
      </ul>

      {!user && (
        <div className="max-w-md">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            showLinks={false}
          />
        </div>
      )}

      {user && (
        <>
          <h2 className="text-xl font-semibold">Tasks</h2>
          {loading && <p>Loading tasks...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
          <ul className="list-disc list-inside">
            {task.map((t) => (
              <li key={t.id}>
                <strong>{t.name}</strong>: {t.description}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
