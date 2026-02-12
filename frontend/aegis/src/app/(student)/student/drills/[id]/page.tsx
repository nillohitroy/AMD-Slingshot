"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Trophy, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
// Optional: npm install canvas-confetti @types/canvas-confetti
import confetti from "canvas-confetti"; 

// --- Types ---
interface Choice {
  id: number;
  text: string;
  is_correct: boolean; 
  explanation: string;
}

interface Question {
  id: number;
  text: string;
  points: number;
  order: number;
  choices: Choice[];
}

interface DrillData {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  questions: Question[];
}

export default function DrillPlayer() {
  const { id } = useParams();
  const router = useRouter();
  
  // State
  const [drill, setDrill] = useState<DrillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Drill Data
  useEffect(() => {
    const fetchDrill = async () => {
      try {
        const res = await api.get(`/student/drills/${id}/`);
        setDrill(res.data);
      } catch (err) {
        console.error("Failed to load drill:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDrill();
  }, [id]);

  // 2. Handle Choice Selection
  const handleSelect = (choiceId: number) => {
    if (isAnswered) return; 
    setSelectedChoiceId(choiceId);
  };

  // 3. Submit Answer Logic (Local Validation)
  const handleSubmitAnswer = () => {
    if (!drill || selectedChoiceId === null) return;
    
    setIsAnswered(true);
    
    const currentQ = drill.questions[currentQIndex];
    const choice = currentQ.choices.find(c => c.id === selectedChoiceId);
    
    if (choice?.is_correct) {
      setScore(prev => prev + currentQ.points);
      // Mini Celebration for correct answer
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#10b981'] 
      });
    }
  };

  // 4. Next Question Logic
  const handleNext = () => {
    if (!drill) return;
    
    if (currentQIndex < drill.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedChoiceId(null);
      setIsAnswered(false);
    } else {
      finishDrill();
    }
  };

  // 5. Finish Drill Logic (Save to Backend)
  const finishDrill = async () => {
    // We calculate the score one last time or use state, 
    // but state 'score' might not be updated if we just added points in the last render.
    // However, since handleNext calls this, the state is usually stable.
    
    setIsSubmitting(true);
    try {
        // --- THE CRITICAL BACKEND CALL ---
        await api.post(`/student/drills/${id}/complete/`, { 
            score: score 
        });

        // Show Results UI
        setShowResult(true);

        // Grand Celebration
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#3b82f6', '#f59e0b']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#3b82f6', '#f59e0b']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();

    } catch (err) {
        console.error("Failed to save progress:", err);
        alert("Network Error: Could not save your score. Please check your connection.");
        // Still show result so user isn't stuck, but maybe warn them
        setShowResult(true);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  if (!drill) return <div className="p-8 text-center">Drill not found.</div>;

  // --- RESULT VIEW ---
  if (showResult) {
    const maxScore = drill.questions.reduce((acc, q) => acc + q.points, 0);
    // Avoid division by zero
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const isPass = percentage >= 70;

    return (
      <div className="max-w-xl mx-auto pt-20 text-center space-y-8 fade-in-up px-4">
        <div className={cn(
            "mx-auto w-32 h-32 rounded-full flex items-center justify-center shadow-2xl mb-6",
            isPass ? "bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/20" : "bg-red-500/10 text-red-500 ring-4 ring-red-500/20"
        )}>
          {isPass ? <Trophy className="w-16 h-16" /> : <AlertTriangle className="w-16 h-16" />}
        </div>
        
        <div className="space-y-2">
            <h1 className="text-4xl font-bold">{isPass ? "Mission Accomplished!" : "Simulation Failed"}</h1>
            <p className="text-xl text-muted-foreground">
                You scored <span className="font-bold text-foreground">{score}</span> / {maxScore}
            </p>
        </div>

        {/* Score Bar */}
        <div className="bg-muted rounded-full h-4 w-full overflow-hidden relative">
            <div 
                className={cn("h-full transition-all duration-1000 ease-out", isPass ? "bg-emerald-500" : "bg-red-500")}
                style={{ width: `${percentage}%` }}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="text-xs text-muted-foreground uppercase font-bold">XP Earned</div>
                <div className="text-2xl font-mono font-bold text-amber-500">+{isPass ? drill.xp_reward : 10} XP</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <div className="text-xs text-muted-foreground uppercase font-bold">Accuracy</div>
                <div className="text-2xl font-mono font-bold">{percentage}%</div>
            </div>
        </div>

        <div className="pt-4 flex gap-4 justify-center">
            <button 
              onClick={() => router.push('/student/drills')}
              className="px-8 py-3 rounded-xl bg-background border border-border hover:bg-muted font-bold transition-colors"
            >
              Return to Base
            </button>
            {!isPass && (
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retry Drill
                </button>
            )}
        </div>
      </div>
    );
  }

  // --- QUESTION VIEW ---
  const currentQ = drill.questions[currentQIndex];
  const selectedChoice = currentQ.choices.find(c => c.id === selectedChoiceId);

  return (
    <div className="max-w-3xl mx-auto pt-8 pb-20 fade-in-up px-4">
      
      {/* Header Info */}
      <div className="mb-8 flex items-center justify-between">
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span>{drill.title}</span>
         </div>
         <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {score} pts
         </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
           <span>Scenario {currentQIndex + 1} / {drill.questions.length}</span>
           <span>{Math.round(((currentQIndex) / drill.questions.length) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
           <div 
             className="h-full bg-primary transition-all duration-500 ease-out" 
             style={{ width: `${((currentQIndex) / drill.questions.length) * 100}%` }} 
           />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-6">
         <h2 className="text-xl md:text-2xl font-bold mb-8 leading-snug">
            {currentQ.text}
         </h2>

         <div className="space-y-3">
            {currentQ.choices.map((choice) => {
              let stateStyle = "border-border hover:border-primary/50 hover:bg-muted/30";
              let icon = <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />;

              if (isAnswered) {
                 if (choice.is_correct) {
                     stateStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
                     icon = <CheckCircle className="w-5 h-5 text-emerald-500 fill-current" />;
                 }
                 else if (choice.id === selectedChoiceId) {
                     stateStyle = "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                     icon = <XCircle className="w-5 h-5 text-red-500 fill-current" />;
                 }
                 else {
                     stateStyle = "border-border opacity-50 grayscale";
                 }
              } else if (choice.id === selectedChoiceId) {
                 stateStyle = "border-primary bg-primary/5 ring-1 ring-primary shadow-[0_0_0_1px_rgba(59,130,246,0.5)]";
                 icon = <div className="w-5 h-5 rounded-full border-[5px] border-primary" />;
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelect(choice.id)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group relative overflow-hidden",
                    stateStyle
                  )}
                >
                   <span className="font-medium pr-4 relative z-10">{choice.text}</span>
                   <div className="shrink-0 relative z-10">{icon}</div>
                </button>
              );
            })}
         </div>
      </div>

      {/* Feedback & Navigation Area */}
      <div className="min-h-[140px]">
         {isAnswered && (
            <div className={cn(
               "p-6 rounded-xl border mb-6 flex gap-4 animate-in slide-in-from-bottom-2 duration-300",
               selectedChoice?.is_correct 
                 ? "bg-emerald-500/10 border-emerald-500/20" 
                 : "bg-red-500/10 border-red-500/20"
            )}>
               <div className={cn("p-2 rounded-full h-fit shrink-0", selectedChoice?.is_correct ? "bg-emerald-500/20 text-emerald-600" : "bg-red-500/20 text-red-600")}>
                  {selectedChoice?.is_correct ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
               </div>
               <div>
                  <h4 className={cn("font-bold mb-1 text-lg", selectedChoice?.is_correct ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400")}>
                     {selectedChoice?.is_correct ? "Correct Analysis" : "Security Breach"}
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                     {selectedChoice?.explanation || currentQ.choices.find(c => c.is_correct)?.explanation}
                  </p>
               </div>
            </div>
         )}

         <div className="flex justify-end">
            {!isAnswered ? (
               <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedChoiceId === null}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 w-full md:w-auto"
               >
                  Submit Analysis
               </button>
            ) : (
               <button
                  onClick={handleNext}
                  className="bg-foreground text-background px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 w-full md:w-auto shadow-lg active:scale-95"
               >
                  {currentQIndex < drill.questions.length - 1 ? "Next Scenario" : (isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Complete Drill")}
                  <ArrowRight className="w-5 h-5" />
               </button>
            )}
         </div>
      </div>
    </div>
  );
}