
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  delay?: number;
}

export const DashboardCard = ({
  title,
  description,
  href,
  icon: Icon,
  delay = 0,
}: DashboardCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Link to={href}>
        <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-100 dark:border-green-900">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl text-gray-800 dark:text-white">
              {title}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
