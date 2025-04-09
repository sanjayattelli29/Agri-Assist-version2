
import { motion } from "framer-motion";
import { AlertTriangle, Award, BookOpen, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Insight = {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  source: string;
};

interface InsightsListProps {
  insights: Insight[];
}

export const InsightsList = ({ insights }: InsightsListProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "High":
        return <AlertTriangle className="h-4 w-4" />;
      case "Medium":
        return <Award className="h-4 w-4" />;
      case "Low":
        return <BookOpen className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Define animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {insights.map((insight, index) => (
        <motion.div key={index} variants={item}>
          <Card className="h-full overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-amber-100 dark:border-amber-900/30 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-800/50 transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold leading-tight text-amber-800 dark:text-amber-300">
                {insight.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${getImpactColor(insight.impact)}`}
                >
                  {getImpactIcon(insight.impact)}
                  {insight.impact} Impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                {insight.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="pt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <span>Source: {insight.source}</span>
              <a 
                href="#" 
                className="inline-flex items-center text-amber-600 dark:text-amber-400 hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Details
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
