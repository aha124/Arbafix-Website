import { Star, Award, ShieldCheck } from "lucide-react";

interface ServiceTrustBannerProps {
  accentColor?: string;
}

export default function ServiceTrustBanner({ accentColor = "primary" }: ServiceTrustBannerProps) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/5 border-primary/20 text-primary",
    red: "bg-red-50 border-red-200 text-red-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
  };

  const iconColor: Record<string, string> = {
    primary: "text-primary",
    red: "text-red-500",
    blue: "text-blue-600",
    green: "text-green-600",
  };

  return (
    <div className={`${colorClasses[accentColor]} border rounded-xl py-3 px-4 mb-8`}>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm font-medium">
        <div className="flex items-center gap-2">
          <Star className={`w-4 h-4 ${iconColor[accentColor]} fill-current`} />
          <span className="text-text-dark">1,200+ Verified Repairs</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className={`w-4 h-4 ${iconColor[accentColor]}`} />
          <span className="text-text-dark">100% Positive eBay Rating</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${iconColor[accentColor]}`} />
          <span className="text-text-dark">Full Refund If Unfixable</span>
        </div>
      </div>
    </div>
  );
}
