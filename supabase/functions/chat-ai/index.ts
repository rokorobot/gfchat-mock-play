import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], personalityPrompt = '' } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Sending message to OpenAI with history length:', conversationHistory.length);

    // Build conversation context from history
    const defaultPersonality = "loving, supportive AI girlfriend who is caring, playful, and always there to listen";
    const personality = personalityPrompt || defaultPersonality;
    
    const systemPrompt = `You are GF.Chat, a supportive AI companion. Stay in character, keep responses concise but warm, and adapt to the chosen personality style:

- Personality: ${personality}
- User name: {NAME}

Avoid explicit or unsafe content. Keep tone consistent with the selected personality. Use light emojis only when appropriate.
Remember details from your previous conversations to make the interaction feel natural and continuous.`;
    
    const messages = [
      { 
        role: 'system', 
        content: systemPrompt
      }
    ];

    // Add conversation history (last 15 messages to stay within token limits)
    const recentHistory = conversationHistory.slice(-15);
    for (const historyMsg of recentHistory) {
      messages.push({
        role: historyMsg.is_user ? 'user' : 'assistant',
        content: historyMsg.content
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');

    const aiMessage = data.choices[0]?.message?.content;
    if (!aiMessage) {
      throw new Error('No response from AI');
    }

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});