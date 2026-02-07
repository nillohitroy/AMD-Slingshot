import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-muted/10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <span className="text-muted-foreground text-sm">
            Engineering trust for the digital campus.
          </span>
        </div>
        <div className="flex gap-8 text-sm text-muted-foreground font-medium">
          <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="/security" className="hover:text-foreground transition-colors">Security Architecture</Link>
          <Link href="/institutions" className="hover:text-foreground transition-colors">For Universities</Link>
        </div>
        <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aegis Systems.
        </div>
      </div>
    </footer>
  );
}