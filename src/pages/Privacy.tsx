export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-foreground">Privacy Policy – GF.Chat</h1>
        
        <div className="space-y-4 text-foreground/80">
          <p>
            GF.Chat and the AI Girlfriend Matchmaker GPT collect limited non-personal data such as user preferences 
            (style, tone, topics) solely for the purpose of generating AI personality recommendations.
          </p>
          
          <p>
            No personally identifiable information or authentication data is stored or shared. 
            All data is processed securely through Supabase and used only to personalize the GF.Chat experience.
          </p>
          
          <p>
            For any questions, contact: <a href="mailto:hello@gf.chat" className="text-primary hover:underline">hello@gf.chat</a>
          </p>
        </div>
      </div>
    </div>
  );
}
