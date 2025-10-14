import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bot, Volume2, Moon, Sun } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/components/ui/use-toast';
import { AIConfigurationTab } from '@/components/settings/AIConfigurationTab';
import { YouConfigurationTab } from '@/components/settings/YouConfigurationTab';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Settings = () => {
  const navigate = useNavigate();
  const { settings, saveSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { theme, setTheme } = useTheme();

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
          {/* Dark Mode Toggle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of your app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                  <span>Dark Mode</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    Switch between light and dark theme
                  </span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <Tabs defaultValue="ai-config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai-config" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Configuration
              </TabsTrigger>
              <TabsTrigger value="you-config" className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                You Configuration
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-config" className="mt-6">
              <AIConfigurationTab />
            </TabsContent>
            
            <TabsContent value="you-config" className="mt-6">
              <YouConfigurationTab />
            </TabsContent>
          </Tabs>

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