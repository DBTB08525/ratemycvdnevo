import { useNavigate } from "react-router-dom";
import dnevoLogo from "@/assets/dnevo-logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Upload,
  Zap,
  LayoutDashboard,
  RefreshCw,
  BookOpen,
  TrendingUp,
  MessageSquareOff,
  ArrowRightLeft,
  Download,
  ShieldCheck,
  Star,
  Clock,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Formatting",
    description:
      "Layout, visual hierarchy, and structural clarity evaluated against what recruiters actually look for.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: RefreshCw,
    title: "Consistency",
    description:
      "Uniform date formats, bullet styles, typography, and terminology. Inconsistencies undermine credibility.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: BookOpen,
    title: "Clarity",
    description:
      "Plain-language readability check. Flags jargon, passive constructions, and ambiguous phrasing.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: TrendingUp,
    title: "Impact",
    description:
      "Achievement strength and quantification. Detects weak action verbs and missing metrics.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: MessageSquareOff,
    title: "Generic Language",
    description:
      "Identifies template filler, buzzword overuse, and vague descriptions that recruiters skip.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: ArrowRightLeft,
    title: "Rewrite Suggestions",
    description:
      "Side-by-side before/after examples showing exactly how to improve your weakest bullet points.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your CV",
    description:
      "Drop in your PDF or Word document. Up to 10 MB, no account required.",
  },
  {
    number: "02",
    icon: Zap,
    title: "AI analysis runs",
    description:
      "Our model scores your CV across 10 categories simultaneously, the same way a senior recruiter would.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Get your report",
    description:
      "Receive a scored breakdown with prioritised quick wins and rewrite examples. Export as PDF.",
  },
];

const testimonials = [
  {
    quote:
      "I'd sent my CV out for weeks with no response. After fixing the issues Rate My CV flagged, I had two interviews booked within four days.",
    name: "James R.",
    role: "Marketing Manager",
    stars: 5,
  },
  {
    quote:
      "We recommend this to every candidate we work with before submission. The impact scoring alone catches things that cost people jobs.",
    name: "Sarah T.",
    role: "Senior Recruiter, Financial Services",
    stars: 5,
  },
  {
    quote:
      "The rewrite suggestions are genuinely useful, not generic advice. It showed me line by line where I was being vague.",
    name: "Priya M.",
    role: "Software Engineer",
    stars: 5,
  },
];

const stats = [
  { value: "10", label: "scored categories" },
  { value: "60s", label: "to full results" },
  { value: "100%", label: "private, data never stored" },
];

export default function Landing() {
  const navigate = useNavigate();

  const handleCTA = () => navigate("/app");

  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif]">
      {/* ── Nav ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img
              src={dnevoLogo}
              alt="Dnevo Partners"
              className="h-7 w-auto"
            />
          </div>
          <Button
            onClick={handleCTA}
            size="sm"
            className="gap-1.5 bg-[hsl(220_90%_50%)] hover:bg-[hsl(220_90%_44%)]"
          >
            Analyse My CV
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 px-6 pb-24 pt-20">
        {/* subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(220 90% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(220 90% 50%) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          {/* Left copy */}
          <div className="max-w-xl">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 border border-blue-100 bg-blue-50 text-blue-700"
            >
              <Zap className="h-3 w-3" />
              Built around how recruiters actually review CVs
            </Badge>

            <h1
              className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get honest feedback on your CV in{" "}
              <span className="text-[hsl(220_90%_50%)]">60 seconds</span>
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-slate-500">
              AI-powered analysis across 10 categories, from formatting and
              structure through to whether it sounds overly AI-written, with
              actionable rewrite suggestions, not just a score.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleCTA}
                size="lg"
                className="gap-2 bg-[hsl(220_90%_50%)] px-8 text-base hover:bg-[hsl(220_90%_44%)]"
              >
                Analyse My CV Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-sm text-slate-400">
                No sign-up · PDF or Word · Results in under a minute
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-5">
              {["No account needed", "Data never stored", "Free to use"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Right — mock score card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="text-sm font-semibold text-slate-400"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Overall Score
                </span>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                  Good: Room to Improve
                </Badge>
              </div>

              <div className="mb-6 flex items-end gap-2">
                <span
                  className="text-7xl font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  74
                </span>
                <span className="mb-3 text-2xl text-slate-300">/100</span>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Formatting", score: 8, color: "bg-[hsl(142_71%_45%)]", pct: 80 },
                  { label: "Consistency", score: 7, color: "bg-[hsl(142_71%_45%)]", pct: 70 },
                  { label: "Clarity", score: 8, color: "bg-[hsl(142_71%_45%)]", pct: 80 },
                  { label: "Impact", score: 6, color: "bg-[hsl(45_93%_47%)]", pct: 60 },
                  { label: "Generic Language", score: 5, color: "bg-[hsl(0_84%_60%)]", pct: 50 },
                ].map(({ label, score, color, pct }) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-600">{label}</span>
                      <span className="font-semibold text-slate-800">
                        {score}/10
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-slate-400">
                Example analysis. Yours takes under 60 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white px-6 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p
                className="text-4xl font-bold text-[hsl(220_90%_50%)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2
              className="mb-3 text-3xl font-bold text-slate-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Three steps to a better CV
            </h2>
            <p className="mx-auto max-w-xl text-slate-500">
              No registration, no waiting. Upload and get your results in under
              a minute.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="relative flex flex-col items-start">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(220_90%_50%)] text-white shadow-md shadow-blue-200">
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className="absolute right-0 top-0 text-6xl font-bold text-slate-100"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {number}
                </span>
                <h3
                  className="mb-2 text-lg font-semibold text-slate-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2
              className="mb-3 text-3xl font-bold text-slate-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What gets analysed
            </h2>
            <p className="mx-auto max-w-xl text-slate-500">
              Every category mirrors how a recruiter reads a CV, not a
              generic grammar checker.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description, color, bg, border }) => (
              <Card
                key={title}
                className={`border ${border} transition-shadow hover:shadow-md`}
              >
                <CardContent className="p-6">
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <h3
                    className="mb-1.5 font-semibold text-slate-900"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-slate-400" />
              Export full report as PDF
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              Results in under 60 seconds
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              PDF, .doc, and .docx supported
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof ──────────────────────────────────────── */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2
              className="mb-3 text-3xl font-bold text-slate-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What candidates and recruiters say
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ quote, name, role, stars }) => (
              <Card
                key={name}
                className="border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-slate-600">
                    "{quote}"
                  </p>
                  <div>
                    <p
                      className="font-semibold text-slate-900"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {name}
                    </p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy / trust strip ─────────────────────────────── */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[hsl(220_90%_50%)] text-white shadow-md shadow-blue-200">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h3
                  className="mb-1 text-lg font-semibold text-slate-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Your CV stays private
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  Your document is processed in-memory and never stored by
                  Dnevo Partners. Analysis is performed by Claude AI (Anthropic)
                  under strict data-processing terms. We comply with UK GDPR.
                  You can read our full privacy notice before submitting.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="bg-[hsl(220_90%_50%)] px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="mb-4 text-4xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to see how your CV scores?
          </h2>
          <p className="mb-8 text-blue-100">
            Free, instant, and no account needed. Find out exactly what's
            holding your CV back and how to fix it.
          </p>
          <Button
            onClick={handleCTA}
            size="lg"
            className="gap-2 bg-white px-10 text-base text-[hsl(220_90%_50%)] hover:bg-blue-50 hover:text-[hsl(220_90%_44%)]"
          >
            Analyse My CV Now
            <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-4 text-sm text-blue-200">
            PDF · Word · Up to 10 MB · Results in under 60 seconds
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <img
              src={dnevoLogo}
              alt="Dnevo Partners"
              className="h-6 w-auto opacity-60"
            />
            <span className="text-sm text-slate-400">
              © {new Date().getFullYear()} Dnevo Partners
            </span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <a
              href="mailto:hello@dnevopartners.com"
              className="hover:text-slate-600"
            >
              hello@dnevopartners.com
            </a>
            <button
              onClick={handleCTA}
              className="hover:text-slate-600"
            >
              Rate My CV
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
