import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bot, Palette, Volume2, Mic } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, saveSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Safety check - return loading if settings not yet loaded
  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-chat p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading settings...</div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings();
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-chat p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/chat')}
            className="mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* AI Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Configuration
              </CardTitle>
              <CardDescription>
                Customize your AI girlfriend's behavior and characteristics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personality Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">1</span>
                  Personality
                </Label>
                <div className="space-y-2">
                  <Label htmlFor="personality" className="text-sm text-muted-foreground">
                    Describe how you want your AI girlfriend to behave and respond
                  </Label>
                  <Textarea
                    id="personality"
                    placeholder="E.g., Be caring, playful, and supportive. Show interest in my hobbies and always be encouraging..."
                    value={settings.personality}
                    onChange={(e) => updateSettings({ personality: e.target.value })}
                    className="min-h-[100px]"
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

              {/* Voice Mode Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">3</span>
                  Voice Mode
                </Label>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-primary" />
                    <div>
                      <Label className="text-sm font-medium">Enable Voice Responses</Label>
                      <p className="text-xs text-muted-foreground">AI will speak her responses aloud</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.voiceMode}
                    onCheckedChange={(checked) => updateSettings({ voiceMode: checked })}
                  />
                </div>
              </div>

              <Separator />

              {/* Voice Section */}
              <div className="space-y-3">
                <Label className="text-base font-medium flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">4</span>
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
                        <SelectItem value="echo">Echo - Deep & Resonant</SelectItem>
                        <SelectItem value="fable">Fable - Warm & Expressive</SelectItem>
                        <SelectItem value="onyx">Onyx - Rich & Smooth</SelectItem>
                        <SelectItem value="nova">Nova - Bright & Energetic</SelectItem>
                        <SelectItem value="shimmer">Shimmer - Light & Airy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground flex items-center justify-between">
                      Voice Volume
                      <span className="text-xs">{settings.voiceVolume}%</span>
                    </Label>
                    <Slider
                      value={[settings.voiceVolume]}
                      onValueChange={(value) => updateSettings({ voiceVolume: value[0] })}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Voice messages will be enabled when you configure this feature
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              className="min-w-[120px]" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;