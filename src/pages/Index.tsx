import { useState } from "react";
import UploadScreen from "@/components/UploadScreen";
import ResultsScreen from "@/components/ResultsScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CategoryScore {
  name: string;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}

interface RewriteExample {
  weak: string;
  better: string;
}

interface AnalysisResult {
  overallScore: number;
  verdict: string;
  categoryScores: CategoryScore[];
  topStrengths: string[];
  mainIssues: string[];
  quickWins: string[];
  rewriteExamples: RewriteExample[];
}

type Screen = "upload" | "loading" | "results";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("upload");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (file: File) => {
    setScreen("loading");

    try {
      const base64 = await fileToBase64(file);

      const { data, error } = await supabase.functions.invoke("analyze-cv", {
        body: {
          fileData: base64,
          fileName: file.name,
          fileType: file.type,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      setScreen("results");
    } catch (e: any) {
      console.error("Analysis failed:", e);
      toast({
        title: "Analysis failed",
        description:
          e?.message || "Something went wrong while reviewing your CV. Please try again.",
        variant: "destructive",
      });
      setScreen("upload");
    }
  };

  const handleReset = () => {
    setResult(null);
    setScreen("upload");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {screen === "upload" && <UploadScreen onSubmit={handleSubmit} />}
        {screen === "loading" && <LoadingScreen />}
        {screen === "results" && result && (
          <ResultsScreen result={result} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default Index;
