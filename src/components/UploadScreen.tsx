import { useCallback, useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onSubmit: (file: File) => void;
  onSubmitText: (text: string) => void;
}

const ACCEPTED = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const UploadScreen = ({ onSubmit, onSubmitText }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [tab, setTab] = useState("upload");
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

  const canSubmit = tab === "upload" ? !!file : pastedText.trim().length >= 50;

  return (
    <div className="text-center space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground">
          See how your CV stacks up
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Get scored on formatting, consistency, clarity, impact, and generic language in under a minute.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Paste Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
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
        </TabsContent>

        <TabsContent value="paste" className="mt-6">
          <Textarea
            placeholder="Paste your CV text here (minimum 50 characters)…"
            className="min-h-[200px] text-sm resize-none"
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
          />
          {pastedText.length > 0 && pastedText.trim().length < 50 && (
            <p className="text-xs text-muted-foreground mt-2">
              Need at least 50 characters to review.
            </p>
          )}
        </TabsContent>
      </Tabs>

      <Button
        size="lg"
        className="w-full text-base h-12"
        disabled={!canSubmit}
        onClick={() => {
          if (tab === "upload" && file) onSubmit(file);
          if (tab === "paste" && pastedText.trim().length >= 50) onSubmitText(pastedText.trim());
        }}
      >
        Rank My CV
      </Button>
    </div>
  );
};

export default UploadScreen;
