import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Zap, ArrowRightLeft, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

const getScoreColor = (score: number, outOf: number = 100) => {
  const pct = (score / outOf) * 100;
  if (pct >= 70) return "text-score-low"; // green
  if (pct >= 40) return "text-score-mid"; // amber
  return "text-score-high"; // red
};

const getBarColor = (score: number) => {
  if (score >= 7) return "bg-[hsl(var(--score-low))]";
  if (score >= 4) return "bg-[hsl(var(--score-mid))]";
  return "bg-[hsl(var(--score-high))]";
};

const ResultsScreen = ({
  result,
  onReset,
}: {
  result: AnalysisResult;
  onReset: () => void;
}) => {
  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <div className="text-center space-y-3">
        <h1
          className={`text-6xl md:text-7xl font-bold font-display tracking-tight ${getScoreColor(
            result.overallScore
          )}`}
        >
          {result.overallScore}
          <span className="text-3xl md:text-4xl text-muted-foreground font-normal">/100</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {result.verdict}
        </p>
      </div>

      {/* Category Scores */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold font-display text-foreground">Score Breakdown</h2>
        <div className="space-y-3">
          {result.categoryScores.map((cat, i) => (
            <CategoryCard key={i} category={cat} />
          ))}
        </div>
      </div>

      {/* Top Strengths */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <CheckCircle2 className="w-5 h-5 text-[hsl(var(--score-low))]" />
            Top Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.topStrengths.map((s, i) => (
              <li key={i} className="text-muted-foreground flex gap-2 text-sm">
                <span className="text-foreground mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Main Issues */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <AlertCircle className="w-5 h-5 text-[hsl(var(--score-high))]" />
            Main Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.mainIssues.map((s, i) => (
              <li key={i} className="text-muted-foreground flex gap-2 text-sm">
                <span className="text-foreground mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick Wins */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-display">
            <Zap className="w-5 h-5 text-[hsl(var(--score-mid))]" />
            Quick Wins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.quickWins.map((s, i) => (
              <li key={i} className="text-muted-foreground flex gap-2 text-sm">
                <span className="text-foreground mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Rewrite Examples */}
      {result.rewriteExamples?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-display">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              Stronger Rewrite Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.rewriteExamples.map((ex, i) => (
              <div key={i} className="space-y-2 text-sm">
                <div className="bg-destructive/10 rounded-lg p-3">
                  <span className="font-medium text-foreground">Weak: </span>
                  <span className="text-muted-foreground">{ex.weak}</span>
                </div>
                <div className="bg-[hsl(var(--score-low))]/10 rounded-lg p-3">
                  <span className="font-medium text-foreground">Better: </span>
                  <span className="text-muted-foreground">{ex.better}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Trust Element */}
      <p className="text-xs text-muted-foreground text-center">
        This review is based on common recruiter checks including layout, clarity, consistency, impact, and generic language.
      </p>

      <Button
        size="lg"
        variant="outline"
        className="w-full text-base h-12"
        onClick={onReset}
      >
        Upload Another CV
      </Button>
    </div>
  );
};

const CategoryCard = ({ category }: { category: CategoryScore }) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold font-display text-sm text-foreground">{category.name}</h3>
          <span className={`font-bold font-display text-lg ${getScoreColor(category.score, 10)}`}>
            {category.score}<span className="text-xs text-muted-foreground font-normal">/10</span>
          </span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getBarColor(category.score)}`}
            style={{ width: `${category.score * 10}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">{category.summary}</p>
        {category.strengths?.length > 0 && category.strengths[0] && (
          <div>
            <p className="text-xs font-medium text-foreground mb-1">What's working:</p>
            <ul className="space-y-1">
              {category.strengths.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                  <span className="text-[hsl(var(--score-low))] mt-0.5">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {category.improvements?.length > 0 && category.improvements[0] && (
          <div>
            <p className="text-xs font-medium text-foreground mb-1">To improve:</p>
            <ul className="space-y-1">
              {category.improvements.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                  <span className="text-[hsl(var(--score-high))] mt-0.5">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsScreen;
