import { LandingNav } from "@/components/layout/landing-nav";
import { Footer } from "@/components/layout/footer";
import { Building2, LineChart, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function InstitutionsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                    Protect your Campus. <br/> Empower your Students.
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Universities are the #1 target for ransomware. Aegis provides a unified defense layer that integrates with your existing SSO (Shibboleth, Okta, Azure AD).
                </p>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-primary w-5 h-5" />
                        <span className="font-medium">Deployment in minutes via DNS</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-primary w-5 h-5" />
                        <span className="font-medium">Full LTI Integration for Canvas/Blackboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-primary w-5 h-5" />
                        <span className="font-medium">Detailed Compliance Reporting</span>
                    </div>
                </div>
                <div className="mt-10">
                    <Link href="/contact" className="bg-primary text-primary-foreground h-12 px-8 rounded-lg inline-flex items-center justify-center font-medium hover:bg-primary/90 transition-all">
                        Request Pilot Program
                    </Link>
                </div>
             </div>
             
             <div className="bg-muted/30 border border-border rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-background border border-border rounded-lg">
                        <Building2 className="w-8 h-8 text-foreground" />
                    </div>
                    <div>
                        <h3 className="font-bold">Enterprise Dashboard</h3>
                        <p className="text-sm text-muted-foreground">Admin View Preview</p>
                    </div>
                </div>
                {/* Mock Chart */}
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>Phishing Attempts (Week)</span>
                        <span className="font-mono font-bold">+12%</span>
                    </div>
                    <div className="h-32 w-full bg-background border border-border rounded-lg flex items-end justify-between p-2 gap-1">
                        {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                            <div key={i} className="bg-primary/20 hover:bg-primary/40 w-full rounded-sm transition-colors" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}