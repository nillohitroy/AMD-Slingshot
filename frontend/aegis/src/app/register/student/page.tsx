"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api"; // Ensure you have this file created from previous steps
import { Logo } from "@/components/ui/logo";
import { 
  ArrowLeft, 
  GraduationCap, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff 
} from "lucide-react";

export default function StudentRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    gradYear: "2025" // Optional, stored for future use
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // 1. Client-Side Validation
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
    }

    if (!formData.email.includes("@")) {
        setError("Please enter a valid email address.");
        setIsLoading(false);
        return;
    }

    // 2. Extract Domain from Email (e.g. "alex@tech.edu" -> "tech.edu")
    // This allows the backend to find the correct Institution automatically.
    const domain = formData.email.split("@")[1];

    try {
      // 3. API Call
      await api.post("/auth/register/student/", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        student_id: formData.studentId,
        institution_domain: domain 
      });

      setSuccess(true);
      // Auto-redirect after 3 seconds
      setTimeout(() => router.push("/login"), 3000);

    } catch (err: any) {
      console.error(err);
      // Handle specific backend errors (e.g., "Institution not found")
      if (err.response?.data) {
          const firstError = Object.values(err.response.data).flat()[0] as string;
          setError(firstError || "Registration failed. Please try again.");
      } else {
          setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success View
  if (success) {
      return (
        <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
             <div className="w-full max-w-lg bg-background border border-border rounded-xl shadow-lg p-12 text-center">
                <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Enrollment Complete!</h2>
                <p className="text-muted-foreground mb-8">
                    Your account has been created successfully. Redirecting you to the login portal...
                </p>
                <Link href="/login" className="w-full block py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
                    Go to Login Now
                </Link>
             </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <Link href="/register" className="absolute top-8 left-8 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
         <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="w-full max-w-lg bg-background border border-border rounded-xl shadow-lg overflow-hidden fade-in-up">
         {/* Header */}
         <div className="p-8 border-b border-border bg-muted/5 text-center">
            <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
               <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Student Enrollment</h1>
            <p className="text-muted-foreground mt-2 text-sm">
               Activate your digital hygiene shield.
            </p>
         </div>

         {/* Form */}
         <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Error Alert */}
            {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-3 text-sm text-destructive animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input 
                    name="firstName"
                    required
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" 
                    placeholder="Jane" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input 
                    name="lastName"
                    required
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" 
                    placeholder="Doe" 
                  />
               </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">University Email</label>
                <input 
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" 
                    placeholder="jane.doe@tech.edu" 
                />
                <p className="text-[10px] text-muted-foreground">
                    Must use your official university domain (e.g. @tech.edu).
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-sm font-medium">Student ID</label>
                  <input 
                    name="studentId"
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" 
                    placeholder="STU-2024-X" 
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium">Graduation Year</label>
                  <select 
                    name="gradYear"
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input px-3 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                     <option value="2025">2025</option>
                     <option value="2026">2026</option>
                     <option value="2027">2027</option>
                     <option value="2028">2028</option>
                  </select>
               </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Create Password</label>
                <div className="relative">
                    <input 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        onChange={handleChange}
                        className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary pr-10" 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <input 
                    name="confirmPassword"
                    type="password"
                    required
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" 
                />
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
               {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
            </button>
            
            <p className="text-xs text-center text-muted-foreground px-4">
               By clicking "Create Account", you agree to the Aegis Acceptable Use Policy.
            </p>
         </form>
      </div>
    </div>
  );
}