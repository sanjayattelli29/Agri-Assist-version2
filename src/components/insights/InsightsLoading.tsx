
import { Loader2 } from "lucide-react";

export const InsightsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-16 w-16 animate-spin text-amber-500" />
      <h3 className="mt-4 text-xl font-medium text-amber-800 dark:text-amber-300">
        Gathering insights...
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We're analyzing agricultural data from across India
      </p>
    </div>
  );
};
