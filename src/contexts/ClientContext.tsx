import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Client = Database['public']['Tables']['clients']['Row'];

interface ClientContextType {
  client: Client | null;
  isLoading: boolean;
  error: Error | null;
  updateBranding: (branding: Partial<Client['branding']>) => Promise<void>;
  updateSettings: (settings: Partial<Client['settings']>) => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const { data: clientUser, error: clientError } = await supabase
        .from('client_users')
        .select('client_id')
        .eq('user_id', supabase.auth.user()?.id)
        .single();

      if (clientError) throw clientError;

      const { data: clientData, error: clientDataError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientUser.client_id)
        .single();

      if (clientDataError) throw clientDataError;
      setClient(clientData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch client data'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateBranding = async (branding: Partial<Client['branding']>) => {
    if (!client) return;

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          branding: { ...client.branding, ...branding }
        })
        .eq('id', client.id);

      if (error) throw error;
      await fetchClientData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update branding'));
      throw err;
    }
  };

  const updateSettings = async (settings: Partial<Client['settings']>) => {
    if (!client) return;

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          settings: { ...client.settings, ...settings }
        })
        .eq('id', client.id);

      if (error) throw error;
      await fetchClientData();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update settings'));
      throw err;
    }
  };

  return (
    <ClientContext.Provider
      value={{
        client,
        isLoading,
        error,
        updateBranding,
        updateSettings,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}