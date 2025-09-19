import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const speak = async (text: string, voice: string = 'alloy') => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice }
      });

      if (error) {
        throw error;
      }

      if (data?.audioContent) {
        // Convert base64 to blob and play
        const audioBlob = new Blob([
          Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
      toast({
        title: 'Speech Error',
        description: 'Failed to generate speech',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { speak, isLoading };
};