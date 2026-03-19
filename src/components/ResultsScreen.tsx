import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface Result {
  ai_score: number;
  summary: string;
  reasons: string[];
  fixes: string[];
}

const getScoreColor = (score: number) => {
  if (score <= 35) return "text-score-low";
  if (score <= 65) return "text-score-mid";
  return "text-score-high";
};

const ResultsScreen = ({
  result,
  onReset,
}: {
  result: Result;
  onReset: () => void;
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1
          className={`text-6xl md:text-7xl font-bold font-display tracking-tight ${getScoreColor(
            result.ai_score
          )}`}
        >
          {result.ai_score}% AI
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {result.summary}
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-secondary/50 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold font-display">
            <AlertTriangle className="w-5 h-5" />
            Why it looks AI-written
          </div>
          <ul className="space-y-2">
            {result.reasons.map((r, i) => (
              <li key={i} className="text-muted-foreground flex gap-2">
                <span className="text-foreground mt-1">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-secondary/50 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold font-display">
            <Lightbulb className="w-5 h-5" />
            How to sound more human
          </div>
          <ul className="space-y-2">
            {result.fixes.map((f, i) => (
              <li key={i} className="text-muted-foreground flex gap-2">
                <span className="text-foreground mt-1">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Button
        size="lg"
        variant="outline"
        className="w-full text-base h-12"
        onClick={onReset}
      >
        Check Another CV
      </Button>
    </div>
  );
};

export default ResultsScreen;
