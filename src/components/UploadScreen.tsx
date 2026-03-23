import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onSubmit: (file: File) => void;
}

const ACCEPTED = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const UploadScreen = ({ onSubmit }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
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
          Get a recruiter-style review across formatting, clarity, impact, and generic language in under a minute.
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

      <Button
        size="lg"
        className="w-full text-base h-12"
        disabled={!file}
        onClick={() => file && onSubmit(file)}
      >
        Upload CV
      </Button>

      <div className="text-left space-y-3 pt-4 border-t border-border">
        <p className="text-sm font-medium text-foreground">What your CV is scored on:</p>
        <ul className="text-sm text-muted-foreground space-y-1.5">
          {[
            "Formatting",
            "Consistency",
            "Achievement-led content",
            "Specificity",
            "Readability",
            "Generic / AI-style language",
            "Overall recruiter impression",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadScreen;
