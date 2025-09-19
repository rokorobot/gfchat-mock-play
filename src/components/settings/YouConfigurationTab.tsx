import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Volume2, Mic } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

        <Separator />

        {/* Appearance Section */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">2</span>
            Appearance
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avatar-style" className="text-sm text-muted-foreground">
                Avatar Style
              </Label>
              <Select value={settings.avatarStyle} onValueChange={(value) => updateSettings({ avatarStyle: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose avatar style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-sm text-muted-foreground">
                Chat Theme
              </Label>
              <Select value={settings.chatTheme} onValueChange={(value) => updateSettings({ chatTheme: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="playful">Playful</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                  <SelectItem value="cozy">Cozy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Voice Settings Section */}
        <div className="space-y-3">
          <Label className="text-base font-medium flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">3</span>
            Voice Settings
          </Label>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice-type" className="text-sm text-muted-foreground">
                Voice Type
              </Label>
              <Select value={settings.voiceType} onValueChange={(value) => updateSettings({ voiceType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloy">Alloy - Neutral & Clear</SelectItem>
                  <SelectItem value="fable">Fable - Warm & Expressive</SelectItem>
                  <SelectItem value="nova">Nova - Bright & Energetic</SelectItem>
                  <SelectItem value="shimmer">Shimmer - Light & Airy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};