"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { 
  ArrowLeft, 
  Building2, 
  Lock, 
  CheckCircle, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function InstitutionRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    studentCount: "Less than 1,000",
    adminName: "",
    adminEmail: "",
    position: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mapping form data to the backend expectation
      // Backend expects: institution_name, admin_email, contact_number
      await api.post("/auth/register/institution/", {
        institution_name: formData.name,
        admin_email: formData.adminEmail,
        contact_number: formData.phone,
        // Extra metadata (optional, depends on if you update backend model)
        domain: formData.domain,
        admin_name: formData.adminName
      });

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err: any) {
      console.error(err);
      setError("Failed to submit application. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-300">
           <div className="h-20 w-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10" />
           </div>
           <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Application Received</h2>
              <p className="text-muted-foreground">
                 Thank you for applying to the Aegis Pilot Program.
              </p>
           </div>
           <div className="bg-muted/30 p-4 rounded-lg text-sm text-left border border-border">
              <p className="mb-2"><strong>Next Steps:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                 <li>Our compliance team will verify your domain: <span className="font-mono text-foreground">{formData.domain}</span></li>
                 <li>An onboarding link will be sent to: <span className="font-mono text-foreground">{formData.adminEmail}</span></li>
                 <li>Expected turnaround: <strong>24 Hours</strong></li>
              </ul>
           </div>
           <Link href="/" className="inline-flex items-center justify-center w-full h-11 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Return to Homepage
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Info - Sticky */}
      <div className="hidden lg:flex w-1/3 flex-col border-r border-border bg-muted/10 p-12 lg:sticky lg:top-0 lg:h-screen">
         <Link href="/" className="flex items-center gap-2 mb-12">
            {/* You can replace text with <Logo /> if imported */}
            <Logo />
         </Link>
         
         <div className="space-y-8">
            <h2 className="text-3xl font-bold leading-tight">Secure your campus infrastructure.</h2>
            
            <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center">
                     <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                     <h3 className="font-medium">SSO Integration</h3>
                     <p className="text-sm text-muted-foreground">Seamless connect with Shibboleth, Okta, or Azure AD.</p>
                  </div>
               </div>
               
               <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-500/10 flex items-center justify-center">
                     <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                     <h3 className="font-medium">Compliance Ready</h3>
                     <p className="text-sm text-muted-foreground">Automated FERPA & SOC2 reporting.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 p-8 lg:p-12 flex flex-col items-center justify-center">
         <div className="w-full max-w-2xl fade-in-up">
            <div className="mb-10 flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Institution Onboarding</h1>
                    <p className="text-muted-foreground">Register your university for the Aegis Pilot Program.</p>
                </div>
                <Link href="/register" className="lg:hidden text-sm text-muted-foreground">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
            </div>

            {error && (
               <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 text-sm text-destructive">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
               {/* Section 1: Organization */}
               <div className="space-y-4 rounded-lg border border-border p-6 shadow-sm">
                  <h3 className="font-semibold flex items-center gap-2">
                     <Building2 className="w-4 h-4 text-primary" /> Organization Details
                  </h3>
                  
                  <div className="grid gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Institution Name</label>
                        <input 
                           name="name"
                           required
                           className="flex h-10 w-full rounded-md border border-input px-3 bg-background focus:ring-2 focus:ring-primary/20 outline-none" 
                           placeholder="Ex: State University of Technology" 
                           onChange={handleChange}
                        />
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Domain</label>
                            <input 
                               name="domain"
                               required
                               className="flex h-10 w-full rounded-md border border-input px-3 bg-background focus:ring-2 focus:ring-primary/20 outline-none" 
                               placeholder="university.edu" 
                               onChange={handleChange}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium">Student Count (Approx)</label>
                            <select 
                               name="studentCount"
                               className="flex h-10 w-full rounded-md border border-input px-3 bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                               onChange={handleChange}
                            >
                                <option>Less than 1,000</option>
                                <option>1,000 - 5,000</option>
                                <option>5,000 - 20,000</option>
                                <option>20,000+</option>
                            </select>
                         </div>
                     </div>
                  </div>
               </div>

               {/* Section 2: Admin */}
               <div className="space-y-4 rounded-lg border border-border p-6 shadow-sm">
                  <h3 className="font-semibold flex items-center gap-2">
                     <Lock className="w-4 h-4 text-primary" /> Administrator Contact
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Admin Full Name</label>
                        <input 
                           name="adminName"
                           required
                           className="flex h-10 w-full rounded-md border border-input px-3 bg-background focus:ring-2 focus:ring-primary/20 outline-none" 
                           onChange={handleChange}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Work Email</label>
                        <input 
                           name="adminEmail"
                           type="email"
                           required
                           className="flex h-10 w-full rounded-md border border-input px-3 bg-background focus:ring-2 focus:ring-primary/20 outline-none" 
                           placeholder="admin@university.edu" 
                           onChange={handleChange}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Position/Title</label>
                        <input 
                           name="position"
                           className="flex h-10 w-full rounded-md border border-input px-3 bg-background focus:ring-2 focus:ring-primary/20 outline-none" 
                           placeholder="IT Director / Dean" 
                           onChange={handleChange}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <input 
                           name="phone"
                           type="tel"
                           required
                           className="flex h-10 w-full rounded-md border border-input px-3 bg-background focus:ring-2 focus:ring-primary/20 outline-none" 
                           placeholder="+1 (555) 000-0000"
                           onChange={handleChange}
                        />
                     </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md text-xs text-muted-foreground border border-border">
                     <span className="font-semibold">Note:</span> For security reasons, the administrator password will be set after application approval via a secure email link.
                  </div>
               </div>

               <div className="flex gap-4 justify-end pt-4">
                  <Link href="/login" className="px-6 py-2 rounded-md border border-border font-medium hover:bg-muted transition-colors flex items-center">
                     Cancel
                  </Link>
                  <button 
                     type="submit" 
                     disabled={isLoading}
                     className="px-8 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                  >
                     {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                     Submit Application
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
}