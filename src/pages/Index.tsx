import { useState } from "react";
import UploadScreen from "@/components/UploadScreen";
import ResultsScreen from "@/components/ResultsScreen";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import dnevoLogo from "@/assets/dnevo-logo.png";

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

/**
 * PRIVACY: All CV data is handled in-memory only.
 * - The file is read as base64 via FileReader, sent to the edge function, and discarded.
 * - Results are held in React state only — lost on refresh, navigation, or tab close.
 * - No CV files, text, or results are saved to localStorage, sessionStorage, databases, or URLs.
 * - Each browser session is fully isolated; concurrent users cannot access each other's data.
 */
const Index = () => {
  const [screen, setScreen] = useState<Screen>("upload");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeCV = async (body: Record<string, string>) => {
    setScreen("loading");
    try {
      let data;

      if (import.meta.env.DEV) {
        const res = await fetch("/api/analyze-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Local analysis failed");
        data = json;
      } else {
        const { data: fnData, error } = await supabase.functions.invoke("analyze-cv", { body });
        if (error) throw error;
        if (fnData?.error) throw new Error(fnData.error);
        data = fnData;
      }

      setResult(data);
      setScreen("results");
    } catch (e: any) {
      console.error("Analysis failed:", e);
      toast({
        title: "Analysis failed",
        description: e?.message || "Something went wrong while reviewing your CV. Please try again.",
        variant: "destructive",
      });
      setScreen("upload");
    }
  };

  const handleSubmitFile = async (file: File) => {
    const base64 = await fileToBase64(file);
    analyzeCV({ fileData: base64, fileName: file.name, fileType: file.type });
  };

  const handleReset = () => {
    setResult(null);
    setScreen("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      {screen !== "results" && (
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <img src={dnevoLogo} alt="Dnevo Partners" className="h-7 w-auto" />
            <a
              href="/"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
            >
              ← Back
            </a>
          </div>
        </header>
      )}
      <div className="flex min-h-[calc(100vh-61px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {screen === "upload" && <UploadScreen onSubmit={handleSubmitFile} />}
          {screen === "loading" && <LoadingScreen />}
          {screen === "results" && result && (
            <ResultsScreen result={result} onReset={handleReset} />
          )}
        </div>
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
