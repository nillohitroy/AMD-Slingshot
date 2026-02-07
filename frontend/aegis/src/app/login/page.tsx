"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Github } from "lucide-react"; // Removed unused imports
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login, isLoading, error } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // This stops the refresh
    console.log("Submitting form..."); // Debug log
    await login(email, password);
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2">
      {/* Left Column: Visuals */}
      <div className="hidden lg:flex flex-col justify-between bg-muted/30 p-12 border-r border-border relative overflow-hidden">
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
         
         <div className="z-10">
            <Link href='/'><Logo className="h-8 w-8" /> </Link>
         </div>

         <div className="z-10 max-w-md">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Secure the future.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              "Aegis has reduced phishing incidents by 94% across our campus network."
            </p>
         </div>
         
         <div className="z-10 text-sm text-muted-foreground">
            © Aegis Security Systems
         </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-background relative">
        <Link href="/" className="absolute top-8 right-8 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
           Back to Home <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="w-full max-w-[400px] flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access the console.
            </p>
          </div>

          {/* FIX IS HERE: Added onSubmit */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
             {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                   {error}
                </div>
             )}

             <div className="space-y-2">
               <label className="text-sm font-medium leading-none" htmlFor="email">
                 Email Address
               </label>
               <input 
                 id="email"
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 placeholder="name@university.edu" 
                 className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
               />
             </div>

             <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none" htmlFor="password">
                        Password
                    </label>
                    <Link href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
               <input 
                 id="password"
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
               />
             </div>

             <button 
               type="submit" 
               disabled={isLoading} 
               className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full mt-2"
             >
               {isLoading ? "Authenticating..." : "Sign In"}
             </button>
          </form>

          {/* Social Logins (Visual Only) */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-muted hover:text-accent-foreground h-11 px-8">
               <Github className="mr-2 h-4 w-4" /> 
               Github
            </button>
            <button className="relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-muted hover:text-accent-foreground h-11 px-8">
               <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
               </svg>
               Google
            </button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-4">
             Don&apos;t have an account?{" "}
             <Link href="/register" className="underline hover:text-primary">
                Get Started
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}