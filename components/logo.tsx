import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0056b3] to-[#003d80]",
          sizeClasses[size]
        )}
      >
        {/* Shield SVG */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-2/3 h-2/3"
        >
          <path
            d="M12 2L4 5V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V5L12 2Z"
            fill="white"
            fillOpacity="0.9"
          />
          <path
            d="M12 6C10.9 6 10 6.9 10 8C10 9.1 10.9 10 12 10C13.1 10 14 9.1 14 8C14 6.9 13.1 6 12 6Z"
            fill="#0056b3"
          />
          <path
            d="M12 11C10.34 11 7 11.84 7 13.5V15H17V13.5C17 11.84 13.66 11 12 11Z"
            fill="#0056b3"
          />
          <circle cx="12" cy="8" r="1.5" fill="#0056b3" />
          <path
            d="M16 12.5C16 11.5 14 10.5 12 10.5C10 10.5 8 11.5 8 12.5V14H16V12.5Z"
            fill="#0056b3"
          />
          {/* Heart icon overlay */}
          <path
            d="M12 17L11.5 16.55C9.5 14.75 8 13.35 8 11.7C8 10.45 9 9.5 10.25 9.5C10.95 9.5 11.6 9.85 12 10.35C12.4 9.85 13.05 9.5 13.75 9.5C15 9.5 16 10.45 16 11.7C16 13.35 14.5 14.75 12.5 16.55L12 17Z"
            fill="#e63946"
          />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold text-[#0056b3] leading-none",
              textSizeClasses[size]
            )}
          >
            MaternalShield
          </span>
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Clinical Decision Support
          </span>
        </div>
      )}
    </div>
  );
}
