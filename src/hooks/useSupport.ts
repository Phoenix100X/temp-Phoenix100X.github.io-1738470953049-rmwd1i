import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useClient } from '../contexts/ClientContext';

interface SupportConfig {
  id: string;
  support_type: string;
  email: string;
  phone?: string;
  hours?: string;
  additional_info?: Record<string, any>;
}

export function useSupport() {
  const { client } = useClient();
  const [supportConfig, setSupportConfig] = useState<Record<string, SupportConfig>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (client?.id) {
      fetchSupportConfig();
    }
  }, [client?.id]);

  const fetchSupportConfig = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('support_config')
        .select('*')
        .eq('client_id', client?.id);

      if (fetchError) throw fetchError;

      const configMap = data?.reduce((acc, config) => ({
        ...acc,
        [config.support_type]: config
      }), {});

      setSupportConfig(configMap || {});
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch support configuration'));
    } finally {
      setLoading(false);
    }
  };

  const updateSupportConfig = async (type: string, config: Partial<SupportConfig>) => {
    try {
      const { error: updateError } = await supabase
        .from('support_config')
        .upsert({
          client_id: client?.id,
          support_type: type,
          ...config,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;
      await fetchSupportConfig();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update support configuration');
    }
  };

  return {
    supportConfig,
    loading,
    error,
    updateSupportConfig
  };
}