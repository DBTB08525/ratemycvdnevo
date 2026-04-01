import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  onSubmit: (file: File) => void;
}

const ACCEPTED = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_SIZE = 10 * 1024 * 1024;

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
      setError("Please upload a PDF or Word document.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File too large. Please upload a smaller CV.");
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
    [handleFile]
  );

  return (
    <div className="text-center space-y-8">
      <div className="space-y-3">
        <h1 className="text-5xl md:text-6xl font-bold font-display tracking-tight text-foreground">
          Rate your CV
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Get scored on formatting, consistency, clarity, impact, and generic language in under a minute.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-12 cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : file
            ? "border-primary/50 bg-primary/5"
            : "border-border hover:border-primary/40"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
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
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-10 h-10 text-muted-foreground" />
          {file ? (
            <p className="text-foreground font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-foreground font-medium">
                Drag & drop your CV here, or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                PDF or Word document
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="space-y-2 text-left">
        <div className="flex items-start gap-3">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
            className="mt-0.5"
          />
          <label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
            I understand my CV will be processed by AI for analysis purposes. We do not store your CV data. By uploading you agree to our Privacy Notice.
          </label>
        </div>
        <button
          type="button"
          onClick={() => setPrivacyOpen(true)}
          className="text-xs text-muted-foreground/70 underline underline-offset-2 hover:text-foreground transition-colors ml-7"
        >
          Read our Privacy Notice
        </button>
      </div>

      <Button
        size="lg"
        className="w-full text-base h-12"
        disabled={!file || !consent}
        onClick={() => file && onSubmit(file)}
      >
        Upload CV
      </Button>

      <p className="text-xs text-muted-foreground/70 text-center">
        Built around how recruiters actually review CVs
      </p>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rate My CV – Privacy Notice</DialogTitle>
            <DialogDescription className="sr-only">Privacy information about how your CV data is processed</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-foreground leading-relaxed">
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
              <p className="text-muted-foreground">Your CV is processed by Anthropic (the company behind Claude AI). Anthropic's privacy policy applies to this processing and can be found at{" "}
                <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">anthropic.com/privacy</a>.
              </p>
            </div>
            <div>
              <p className="font-semibold">Your rights</p>
              <p className="text-muted-foreground">Under UK GDPR you have the right to access, correct, or request deletion of your personal data. Contact us at{" "}
                <a href="mailto:hello@dnevopartners.com" className="underline hover:text-foreground">hello@dnevopartners.com</a>{" "}if you have any concerns.
              </p>
            </div>
            <div>
              <p className="font-semibold">Data retention</p>
              <p className="text-muted-foreground">We do not retain your CV. Results are generated in real time and your file is not saved to our systems.</p>
            </div>
            <div>
              <p className="font-semibold">Contact</p>
              <p className="text-muted-foreground">Dnevo Partners — <a href="mailto:hello@dnevo.com" className="underline hover:text-foreground">hello@dnevo.com</a></p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadScreen;
