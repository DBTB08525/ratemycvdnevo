import { useCallback, useRef, useState } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  onSubmit: (file: File) => void;
}

const ACCEPTED =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_SIZE = 10 * 1024 * 1024;


function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const UploadScreen = ({ onSubmit }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError("");
    const name = f.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx") && !name.endsWith(".doc")) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File exceeds the 10 MB limit. Please try a smaller file.");
      return;
    }
    setFile(f);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const canSubmit = !!file && consent;

  return (
    /* Outer card */
    <div className="rounded-3xl bg-white shadow-2xl shadow-slate-200/60 ring-1 ring-slate-900/5">
      <div className="p-8 sm:p-10">

        {/* ── Heading ─────────────────────────────────────── */}
        <div className="mb-8">
          <h1
            className="text-[2.25rem] font-bold leading-tight tracking-tight text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Analyse your CV
          </h1>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-slate-500">
            Get scored across 10 categories, from formatting and structure
            through to whether it sounds overly AI-written, in under a minute.
          </p>

        </div>

        {/* ── Upload zone ─────────────────────────────────── */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {file ? (
          /* File selected — compact receipt */
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(220_90%_50%)] text-white shadow-sm shadow-blue-200">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-semibold text-slate-800"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {file.name}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs text-slate-400">
                    {formatBytes(file.size)} · Ready to analyse
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-400 transition-colors hover:border-[hsl(220_90%_50%)]/50 hover:text-[hsl(220_90%_50%)]"
            >
              Change file
            </button>
          </div>
        ) : (
          /* Drop target */
          <div
            className={`group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 ${
              dragOver
                ? "border-[hsl(220_90%_50%)] bg-blue-50"
                : "border-slate-200 bg-slate-50/60 hover:border-[hsl(220_90%_50%)]/60 hover:bg-blue-50/30"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-5 px-8 py-14 text-center">
              {/* Icon */}
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-all duration-200 ${
                  dragOver
                    ? "bg-[hsl(220_90%_50%)] text-white shadow-lg shadow-blue-200"
                    : "bg-white text-slate-400 ring-1 ring-slate-200 group-hover:ring-[hsl(220_90%_50%)]/40 group-hover:text-[hsl(220_90%_50%)]"
                }`}
              >
                <Upload className="h-7 w-7" />
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <p
                  className="text-base font-semibold text-slate-800"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {dragOver ? "Release to upload" : "Drop your CV here"}
                </p>
                <p className="text-sm text-slate-400">
                  or{" "}
                  <span className="font-medium text-[hsl(220_90%_50%)] underline underline-offset-2">
                    browse to choose a file
                  </span>
                </p>
              </div>

              {/* Format badges */}
              <div className="flex items-center gap-2">
                {["PDF", "DOC", "DOCX"].map((ext) => (
                  <span
                    key={ext}
                    className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 shadow-sm"
                  >
                    {ext}
                  </span>
                ))}
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">Max 10 MB</span>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-red-500">
            <X className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        {/* ── Divider ─────────────────────────────────────── */}
        <div className="my-7 border-t border-slate-100" />

        {/* ── Consent ─────────────────────────────────────── */}
        <div className="flex items-start gap-3.5">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            className="mt-[3px] shrink-0"
          />
          <label
            htmlFor="consent"
            className="cursor-pointer text-sm leading-relaxed text-slate-500"
          >
            I understand my CV will be processed by AI for analysis. Dnevo Partners
            do not store your data.{" "}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); setPrivacyOpen(true); }}
              className="font-medium text-slate-700 underline underline-offset-2 transition-colors hover:text-slate-900"
            >
              Read our Privacy Notice
            </button>
            .
          </label>
        </div>

        {/* ── Submit ──────────────────────────────────────── */}
        <div className="mt-6">
          <Button
            size="lg"
            className={`h-14 w-full gap-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
              canSubmit
                ? "bg-[hsl(220_90%_50%)] shadow-lg shadow-blue-200 hover:bg-[hsl(220_90%_44%)] hover:shadow-blue-300"
                : "bg-slate-200 text-slate-400 shadow-none hover:bg-slate-200"
            }`}
            disabled={!canSubmit}
            onClick={() => file && onSubmit(file)}
          >
            {canSubmit ? (
              <>
                Analyse My CV
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                {!file ? "Upload a CV to continue" : "Tick the box above to continue"}
              </>
            )}
          </Button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your CV is never stored. Processed in memory only.
          </p>
        </div>
      </div>

      {/* ── Privacy dialog ──────────────────────────────── */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Notice</DialogTitle>
            <DialogDescription className="sr-only">
              How your CV data is processed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed text-foreground">
            <p>This tool is provided by Dnevo Partners. When you upload your CV, here's what you need to know.</p>
            <div>
              <p className="font-semibold">What we collect</p>
              <p className="text-muted-foreground">The CV file you upload, which may contain personal data including your name, contact details, work history, and qualifications.</p>
            </div>
            <div>
              <p className="font-semibold">What we do with it</p>
              <p className="text-muted-foreground">Your CV is sent to Anthropic's API for real-time analysis. It is not stored in our systems after your results are generated. We do not use your CV for any other purpose.</p>
            </div>
            <div>
              <p className="font-semibold">Third party processing</p>
              <p className="text-muted-foreground">
                Your CV is processed by Anthropic (the company behind Claude AI). Anthropic's privacy policy applies and can be found at{" "}
                <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">anthropic.com/privacy</a>.
              </p>
            </div>
            <div>
              <p className="font-semibold">Your rights</p>
              <p className="text-muted-foreground">
                Under UK GDPR you have the right to access, correct, or request deletion of your personal data. Contact us at{" "}
                <a href="mailto:hello@dnevopartners.com" className="underline hover:text-foreground">hello@dnevopartners.com</a>.
              </p>
            </div>
            <div>
              <p className="font-semibold">Data retention</p>
              <p className="text-muted-foreground">We do not retain your CV. Results are generated in real time and never saved to our systems.</p>
            </div>
            <div>
              <p className="font-semibold">Contact</p>
              <p className="text-muted-foreground">Dnevo Partners: <a href="mailto:hello@dnevopartners.com" className="underline hover:text-foreground">hello@dnevopartners.com</a></p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadScreen;
