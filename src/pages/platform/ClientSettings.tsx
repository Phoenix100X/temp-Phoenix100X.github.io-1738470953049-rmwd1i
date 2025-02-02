import React from 'react';
import { useClient } from '../../contexts/ClientContext';
import { Palette, Settings, Shield } from 'lucide-react';

export function ClientSettings() {
  const { client, updateBranding, updateSettings } = useClient();

  if (!client) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Client Settings</h1>

      <div className="space-y-6">
        {/* Branding Settings */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <Palette className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Branding</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="text"
                value={client.branding.logo || ''}
                onChange={(e) => updateBranding({ logo: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={client.branding.primary_color}
                onChange={(e) => updateBranding({ primary_color: e.target.value })}
                className="h-10 w-20"
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Features</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {Object.entries(client.settings.features).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {feature}
                </label>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => updateSettings({
                    features: {
                      ...client.settings.features,
                      [feature]: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Children
              </label>
              <input
                type="number"
                value={client.settings.max_children || ''}
                onChange={(e) => updateSettings({
                  max_children: e.target.value ? parseInt(e.target.value) : null
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Staff
              </label>
              <input
                type="number"
                value={client.settings.max_staff || ''}
                onChange={(e) => updateSettings({
                  max_staff: e.target.value ? parseInt(e.target.value) : null
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}