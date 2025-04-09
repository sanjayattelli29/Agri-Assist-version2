
import { Loader2 } from "lucide-react";

export const NewsLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-16 w-16 animate-spin text-green-500" />
      <h3 className="mt-4 text-xl font-medium text-green-800 dark:text-green-300">
        Fetching latest news...
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We're gathering agricultural news from across India
      </p>
    </div>
  );
};
