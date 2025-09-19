import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Volume2, Mic } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/hooks/useSettings';

export const YouConfigurationTab = () => {
  const { settings, updateSettings } = useSettings();

  if (!settings) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          You Configuration
        </CardTitle>
        <CardDescription>
          Customize your personal preferences and interaction settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Input Section */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">1</span>
            Voice Input
          </Label>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-primary" />
              <Label className="text-sm font-medium">Enable Voice Input</Label>
            </div>
            <Switch
              checked={settings.voiceMode}
              onCheckedChange={(checked) => updateSettings({ voiceMode: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};