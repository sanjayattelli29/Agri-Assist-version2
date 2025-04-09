
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Tag, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type News = {
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: string;
  readTime: string;
  url?: string;
};

interface NewsListProps {
  news: News[];
}

export const NewsList = ({ news }: NewsListProps) => {
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "general_agriculture": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "crop_production": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "agritech": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "market_prices": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      "climate_updates": "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
      "government_schemes": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "farmer_stories": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      default: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    
    return colorMap[category] || colorMap.default;
  };

  // Format the date in a readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
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
      {news.map((newsItem, index) => (
        <motion.div key={index} variants={item}>
          <Card className="h-full overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-green-100 dark:border-green-900/30 hover:shadow-md hover:border-green-200 dark:hover:border-green-800/50 transition-all duration-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className={`flex items-center gap-1 ${getCategoryColor(newsItem.category)}`}
                >
                  <Tag className="h-3 w-3" />
                  {newsItem.category.replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold leading-tight text-green-800 dark:text-green-300">
                {newsItem.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-700 dark:text-gray-300">
                {newsItem.summary}
              </CardDescription>
            </CardContent>
            <CardFooter className="pt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(newsItem.publishedAt)}
                </span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {newsItem.readTime}
                </span>
              </div>
              <a 
                href={newsItem.url || "#"} 
                className="inline-flex items-center text-green-600 dark:text-green-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => !newsItem.url && e.preventDefault()}
              >
                {newsItem.source}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
