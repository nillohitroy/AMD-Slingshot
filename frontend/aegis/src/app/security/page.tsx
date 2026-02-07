import { LandingNav } from "@/components/layout/landing-nav";
import { Footer } from "@/components/layout/footer";
import { Lock, Server, Shield } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
               <Lock className="w-3 h-3 mr-2" /> Security Whitepaper
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Zero-Trust Architecture</h1>
            <p className="text-xl text-muted-foreground">
              How we secure the campus without compromising privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Tech Stack 1 */}
            <div className="bg-card border border-border p-6 rounded-xl">
               <h3 className="font-mono text-lg font-bold text-primary mb-2">AES-256 Encryption</h3>
               <p className="text-sm text-muted-foreground">All data at rest is encrypted using industry-standard AES-256. Keys are rotated daily via KMS.</p>
            </div>
             {/* Tech Stack 2 */}
             <div className="bg-card border border-border p-6 rounded-xl">
               <h3 className="font-mono text-lg font-bold text-primary mb-2">Differential Privacy</h3>
               <p className="text-sm text-muted-foreground">We inject statistical noise into datasets. This allows aggregate analysis without exposing individual records.</p>
            </div>
             {/* Tech Stack 3 */}
             <div className="bg-card border border-border p-6 rounded-xl">
               <h3 className="font-mono text-lg font-bold text-primary mb-2">Edge Compute</h3>
               <p className="text-sm text-muted-foreground">Threat analysis happens on the Edge, closer to the user, reducing the attack surface area.</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Server className="w-6 h-6" /> Data Minimization Policy
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    We strictly adhere to a "Need to Know" data policy. Aegis does not store browsing history. We only store <strong>Threat Events</strong>. If a student visits a safe site, no log is created. If they visit a malicious site, we log the threat metadata, not the user's full session context.
                </p>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6" /> Compliance
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border border-border p-4 rounded text-center font-mono text-sm font-semibold">GDPR Ready</div>
                    <div className="border border-border p-4 rounded text-center font-mono text-sm font-semibold">SOC 2 Type II</div>
                    <div className="border border-border p-4 rounded text-center font-mono text-sm font-semibold">FERPA</div>
                    <div className="border border-border p-4 rounded text-center font-mono text-sm font-semibold">ISO 27001</div>
                </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}