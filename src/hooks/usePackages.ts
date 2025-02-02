import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type CarePackage = Database['public']['Tables']['care_packages']['Row'];

export function usePackages() {
  const [packages, setPackages] = useState<CarePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('care_packages')
        .select('*');
      
      if (error) throw error;
      setPackages(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch packages'));
    } finally {
      setLoading(false);
    }
  };

  return { packages, loading, error, refetch: fetchPackages };
}