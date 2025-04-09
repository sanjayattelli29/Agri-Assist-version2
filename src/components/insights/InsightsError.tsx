
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightsErrorProps {
  error: Error;
  onRetry: () => void;
}

export const InsightsError = ({ error, onRetry }: InsightsErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertOctagon className="h-16 w-16 text-red-500" />
      <h3 className="mt-4 text-xl font-medium text-red-800 dark:text-red-300">
        Failed to load insights
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        {error?.message || "An unexpected error occurred while retrieving agricultural insights."}
      </p>
      <Button 
        onClick={onRetry}
        variant="outline"
        className="mt-6"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
};
