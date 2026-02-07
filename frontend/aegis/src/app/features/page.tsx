import { LandingNav } from "@/components/layout/landing-nav";
import { Footer } from "@/components/layout/footer";
import { Brain, FileCode, Users, Eye } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">System Modules</h1>
            <p className="text-xl text-muted-foreground">
              A breakdown of the Aegis defense architecture.
            </p>
          </div>

          <div className="grid gap-12">
            {/* Module A */}
            <div className="flex flex-col md:flex-row gap-8 items-start border-b border-border pb-12">
              <div className="h-16 w-16 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Cognitive "Teach-Back" Engine</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Traditional antiviruses silently block threats. Aegis intercepts the request and displays a "Teachable Moment" overlay. Using a local LLM, it explains specifically <em>why</em> the site was blocked (e.g., "This site uses a homoglyph attack, replacing 'o' with '0'").
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Contextual explanation of threats.</li>
                  <li>Micro-quizzes to verify student understanding.</li>
                  <li>Reduces repeat offenses by 60%.</li>
                </ul>
              </div>
            </div>

            {/* Module B */}
            <div className="flex flex-col md:flex-row gap-8 items-start border-b border-border pb-12">
              <div className="h-16 w-16 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Eye className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Visual Phishing Detection</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sophisticated phishing sites pass standard domain blocklists. Aegis uses Computer Vision to analyze the rendered webpage visually. If a page <em>looks</em> like the University Login Portal but is hosted on a foreign IP, it is flagged immediately.
                </p>
              </div>
            </div>

            {/* Module C */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                <FileCode className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Malware Sandboxing</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Downloads are pre-screened in a cloud-based ephemeral sandbox. Files are executed in isolation to check for behavioral anomalies (like ransomware encryption attempts) before the student can open them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}