import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  // Option to hide text for compact views
  hideText?: boolean;
}

export function Logo({ className, hideText = false, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        {...props}
      >
        {/* Outer Shield/A-frame */}
        <path d="M12 2L2 7l2 13c0 0 3 2 8 2s8-2 8-2l2-13-10-5z" />
        {/* Inner Digital Core representing the 'A' crossbar and circuit */}
        <path d="M9.5 10h5" />
        <path d="M12 10v8" />
        <path d="M12 22a3 3 0 0 0 0-6 3 3 0 0 0 0 6z" className="scale-50 origin-bottom"/>
      </svg>
      {!hideText && (
        <span className="font-sans text-lg font-bold tracking-tight">
          Aegis
        </span>
      )}
    </div>
  );
}