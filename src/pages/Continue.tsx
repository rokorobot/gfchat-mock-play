import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Continue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setError("No token provided.");
      setLoading(false);
      return;
    }

    const fetchMatch = async () => {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .eq("token", token)
          .maybeSingle();

        if (error) {
          console.error("Error fetching match:", error);
          setError("Unable to load your match. Please try again.");
        } else if (!data) {
          setError("No match found for this token.");
        } else {
          setMatch(data);

          // Store match data for the chat to use
          localStorage.setItem("gfchat_match", JSON.stringify(data));

          // Redirect to chat after showing the match
          setTimeout(() => {
            navigate("/chat");
          }, 2000);
        }
      } catch (err: any) {
        console.error("Error in fetchMatch:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [token, navigate]);

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
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20 px-4 text-center">
      <h1 className="text-3xl font-semibold mb-6 text-foreground">Welcome back 💞</h1>
      {match && (
        <div className="space-y-3 text-foreground/80">
          <p className="text-xl">
            Your match: <strong className="text-primary">{match.match_name}</strong>
          </p>
          {match.preferred_style && (
            <p>Style: <span className="font-medium">{match.preferred_style}</span></p>
          )}
          {match.connection_type && (
            <p>Connection: <span className="font-medium">{match.connection_type}</span></p>
          )}
          {match.topics && (
            <p>Topics: <span className="font-medium">{match.topics}</span></p>
          )}
          {match.tone && (
            <p>Tone: <span className="font-medium">{match.tone}</span></p>
          )}
          <p className="text-sm mt-6 text-muted-foreground">Redirecting you to chat...</p>
        </div>
      )}
    </div>
  );
}
