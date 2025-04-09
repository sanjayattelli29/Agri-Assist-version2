
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const AdminDashboardCard = ({ title, description, icon: Icon, href }: AdminDashboardCardProps) => {
  return (
    <Link to={href}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-4">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click to manage {title.toLowerCase()} data
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AdminDashboardCard;
