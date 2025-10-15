import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Continue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Fetch authenticated user if any
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  // Fetch lead (match preferences) from Supabase
  useEffect(() => {
    if (!token) {
      setError("No token provided.");
      setLoading(false);
      return;
    }

    const fetchLead = async () => {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("token", token)
          .maybeSingle();

        if (error || !data) {
          setError("No match found for this token.");
          return;
        }

        setMatch(data);
        localStorage.setItem("gfchat_match", JSON.stringify(data));
        localStorage.setItem("gfchat_match_token", token);

        // If user is logged in, link this lead to their account
        if (user) {
          await supabase
            .from("leads")
            .update({ user_id: user.id })
            .eq("token", token);
          // Redirect straight to chat
          setTimeout(() => navigate("/chat"), 1500);
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [token, user, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20 px-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-xl text-foreground">Loading your match...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20 px-4 text-center">
        <p className="text-xl text-destructive mb-4">{error}</p>
        <Button onClick={() => navigate("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  // If user is not logged in — show match preview + join link
  if (!user && match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20 px-4 text-center">
        <h1 className="text-3xl font-semibold mb-3 text-foreground">
          Meet {match.match_name} 💞
        </h1>
        <div className="space-y-2 mb-6 text-foreground/80">
          <p>
            <span className="font-medium">Style:</span> {match.preferred_style} — <span className="font-medium">Connection:</span> {match.connection_type}
          </p>
          <p>
            <span className="font-medium">Topics she loves:</span> {match.topics}
          </p>
          {match.tone && (
            <p>
              <span className="font-medium">Tone:</span> {match.tone}
            </p>
          )}
        </div>
        <p className="mb-6 text-lg text-foreground">
          She's ready to start chatting with you!
        </p>
        <Button onClick={() => navigate("/auth")} size="lg">
          Join GF.Chat to continue →
        </Button>
      </div>
    );
  }

  // If user is logged in — redirecting handled in useEffect
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20 px-4 text-center">
      <h2 className="text-2xl mb-2 text-foreground">
        Loading your chat with {match?.match_name} 💞
      </h2>
      <p className="text-muted-foreground">Please wait...</p>
    </div>
  );
}
