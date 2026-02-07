"use client";

import { LifeBuoy, MessageSquare, FileQuestion, Book, Mail } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
         <h2 className="text-3xl font-bold mb-2">How can we help?</h2>
         <p className="text-muted-foreground">Search our knowledge base or get in touch with engineering.</p>
         
         <div className="max-w-xl mx-auto mt-6">
            <input 
               type="text" 
               className="w-full h-12 px-5 rounded-full border border-border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
               placeholder="Search for 'SSO Integration', 'False Positives'..."
            />
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
         <Card icon={Book} title="Documentation" desc="Detailed guides on API integration and deployment." />
         <Card icon={FileQuestion} title="FAQs" desc="Common questions about privacy and compliance." />
         <Card icon={MessageSquare} title="Community Forum" desc="Connect with other University CISOs." />
      </div>

      <div className="bg-muted/20 border border-border rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-muted-foreground">Our engineering team is available 24/7 for critical incidents.</p>
         </div>
         <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
            <Mail className="w-4 h-4" /> Open Support Ticket
         </button>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, desc }: any) {
   return (
      <div className="p-6 border border-border rounded-xl bg-background hover:border-primary/50 transition-colors cursor-pointer group">
         <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Icon className="w-5 h-5" />
         </div>
         <h3 className="font-semibold mb-2">{title}</h3>
         <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
   );
}