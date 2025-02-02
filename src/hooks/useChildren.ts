import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Child = Database['public']['Tables']['children']['Row'];

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('children')
        .select('*');
      
      if (error) throw error;
      setChildren(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch children'));
    } finally {
      setLoading(false);
    }
  };

  return { children, loading, error, refetch: fetchChildren };
}