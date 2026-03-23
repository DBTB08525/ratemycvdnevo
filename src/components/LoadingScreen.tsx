import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const messages = [
  "Checking structure and formatting",
  "Looking for vague language",
  "Assessing achievements and impact",
  "Reviewing consistency and readability",
  "Analysing keyword usage",
  "Evaluating overall presentation",
];

const LoadingScreen = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-6 py-20">
      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-display text-foreground">
          Reviewing your CV like a recruiter…
        </h2>
        <p className="text-muted-foreground transition-opacity duration-300">
          {messages[msgIndex]}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
