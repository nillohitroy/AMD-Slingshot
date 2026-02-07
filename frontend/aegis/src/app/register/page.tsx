import Link from "next/link";
import { GraduationCap, Building2 } from "lucide-react";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Choose your path</h1>
        <p className="text-muted-foreground text-lg">
          Select how you want to deploy or use Aegis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Student Path */}
        <Link href="/register/student" className="group p-8 border border-border rounded-2xl hover:border-primary transition-all hover:shadow-lg bg-card">
          <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
            <GraduationCap className="h-7 w-7 text-primary group-hover:text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">I am a Student</h3>
          <p className="text-muted-foreground">
            Log in with your university credentials to activate your personal digital defense shield.
          </p>
        </Link>

        {/* Institution Path */}
        <Link href="/register/institution" className="group p-8 border border-border rounded-2xl hover:border-indigo-500 transition-all hover:shadow-lg bg-card">
          <div className="h-14 w-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Building2 className="h-7 w-7 text-indigo-500 group-hover:text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">I represent an Institution</h3>
          <p className="text-muted-foreground">
            Schedule a demo, view compliance docs, and integrate Aegis with your campus Identity Provider (IdP).
          </p>
        </Link>
      </div>
    </div>
  );
}