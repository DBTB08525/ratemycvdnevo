import { Loader2 } from "lucide-react";

const LoadingScreen = () => (
  <div className="text-center space-y-6 py-20">
    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
    <div className="space-y-2">
      <h2 className="text-2xl font-bold font-display text-foreground">
        Analysing your CV…
      </h2>
      <p className="text-muted-foreground">This usually takes a few seconds.</p>
    </div>
  </div>
);

export default LoadingScreen;
