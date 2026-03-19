import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onSubmit: (file: File) => void;
}

const ACCEPTED = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const UploadScreen = ({ onSubmit }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.toLowerCase();
    if (ext.endsWith(".pdf") || ext.endsWith(".docx")) {
      setFile(f);
    }
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
        <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground">
          How AI is your CV?
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload your CV and find out how AI-written it looks to recruiters.
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
                Drag & drop your CV here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse · PDF or DOCX
              </p>
            </>
          )}
        </div>
      </div>

      <Button
        size="lg"
        className="w-full text-base h-12"
        disabled={!file}
        onClick={() => file && onSubmit(file)}
      >
        Check My CV
      </Button>
    </div>
  );
};

export default UploadScreen;
