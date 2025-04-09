import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, 
  LineChart, Line, 
  PieChart, Pie, Cell,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
  ScatterChart, Scatter, ZAxis
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ChartBarIcon, 
  ChartLineIcon, 
  PieChartIcon, 
  ActivityIcon,
  UsersIcon,
  TrendingUpIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  TargetIcon
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Types for our analytics data
interface PageView {
  page: string;
  views: number;
  title: string;
  date?: string;
  bounceRate?: number;
  avgTimeSpent?: number;
}

interface CropPrediction {
  crop: string;
  count: number;
  accuracy: number;
  season: string;
}

interface ChatbotQuery {
  query: string;
  count: number;
  satisfaction: number;
  category: string;
}

interface TrendData {
  date: string;
  users: number;
  predictions: number;
  queries: number;
  revenue?: number;
  conversion?: number;
}

interface UserEngagement {
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

// Add new interfaces for real data
interface UserSession {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  duration: number;
  page_views: number;
}

interface UserLocation {
  country: string;
  region: string;
  city: string;
  users: number;
  sessions: number;
}

interface FeatureUsage {
  feature: string;
  usage_count: number;
  success_rate: number;
  avg_time_spent: number;
}

const AdminAnalytics = () => {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "all">("week");
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "pie" | "scatter">("bar");
  const [metricType, setMetricType] = useState<"views" | "engagement" | "revenue">("views");

  // Fetch page views data with enhanced metrics
  const { data: pageViewsData, isLoading: pageViewsLoading } = useQuery({
    queryKey: ["pageViews", timeframe],
    queryFn: async () => {
      return [
        { page: "dashboard", views: 124, title: "Dashboard", bounceRate: 15, avgTimeSpent: 4.5 },
        { page: "crop-prediction", views: 85, title: "Crop Prediction", bounceRate: 12, avgTimeSpent: 6.2 },
        { page: "chatbot", views: 67, title: "Chatbot", bounceRate: 8, avgTimeSpent: 8.1 },
        { page: "pesticide-guide", views: 42, title: "Pesticide Guide", bounceRate: 18, avgTimeSpent: 5.3 },
        { page: "fertilizer-guide", views: 38, title: "Fertilizer Guide", bounceRate: 20, avgTimeSpent: 4.8 },
        { page: "soil-requirements", views: 31, title: "Soil Requirements", bounceRate: 14, avgTimeSpent: 7.2 },
        { page: "crop-rotation", views: 25, title: "Crop Rotation", bounceRate: 16, avgTimeSpent: 6.5 },
      ];
    },
  });

  // Fetch crop predictions data with accuracy metrics
  const { data: cropPredictionsData, isLoading: cropPredictionsLoading } = useQuery({
    queryKey: ["cropPredictions", timeframe],
    queryFn: async () => {
      return [
        { crop: "rice", count: 42, accuracy: 92, season: "Kharif" },
        { crop: "wheat", count: 38, accuracy: 88, season: "Rabi" },
        { crop: "maize", count: 27, accuracy: 85, season: "Kharif" },
        { crop: "chickpea", count: 21, accuracy: 90, season: "Rabi" },
        { crop: "kidneybeans", count: 18, accuracy: 87, season: "Kharif" },
        { crop: "pigeonpeas", count: 15, accuracy: 89, season: "Kharif" },
        { crop: "mothbeans", count: 12, accuracy: 84, season: "Rabi" },
        { crop: "mungbean", count: 10, accuracy: 86, season: "Kharif" },
        { crop: "blackgram", count: 8, accuracy: 91, season: "Kharif" },
        { crop: "lentil", count: 7, accuracy: 93, season: "Rabi" },
      ];
    },
  });

  // Fetch chatbot queries data with satisfaction metrics
  const { data: chatbotQueriesData, isLoading: chatbotQueriesLoading } = useQuery({
    queryKey: ["chatbotQueries", timeframe],
    queryFn: async () => {
      return [
        { query: "pest control", count: 35, satisfaction: 4.5, category: "Plant Protection" },
        { query: "fertilizer recommendations", count: 28, satisfaction: 4.2, category: "Soil Management" },
        { query: "water requirements", count: 25, satisfaction: 4.7, category: "Irrigation" },
        { query: "disease identification", count: 22, satisfaction: 4.3, category: "Plant Protection" },
        { query: "crop rotation", count: 18, satisfaction: 4.6, category: "Crop Management" },
        { query: "planting season", count: 15, satisfaction: 4.8, category: "Crop Management" },
        { query: "soil pH", count: 12, satisfaction: 4.4, category: "Soil Management" },
        { query: "organic farming", count: 10, satisfaction: 4.9, category: "Sustainable Farming" },
        { query: "seed quality", count: 8, satisfaction: 4.1, category: "Crop Management" },
        { query: "market prices", count: 7, satisfaction: 3.9, category: "Market Information" },
      ];
    },
  });

  // Fetch user engagement metrics
  const { data: engagementData, isLoading: engagementLoading } = useQuery({
    queryKey: ["engagement", timeframe],
    queryFn: async () => {
      return [
        { metric: "Active Users", value: 1250, change: 12, trend: "up" },
        { metric: "Session Duration", value: 8.5, change: 5, trend: "up" },
        { metric: "Bounce Rate", value: 15, change: -3, trend: "down" },
        { metric: "Conversion Rate", value: 4.2, change: 8, trend: "up" },
      ];
    },
  });

  // Fetch real user sessions data
  const { data: userSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["userSessions", timeframe],
    queryFn: async () => {
      return [
        { id: "1", user_id: "user1", start_time: "2024-03-20T10:00:00", end_time: "2024-03-20T10:30:00", duration: 30, page_views: 5 },
        { id: "2", user_id: "user2", start_time: "2024-03-20T11:00:00", end_time: "2024-03-20T11:45:00", duration: 45, page_views: 8 },
        { id: "3", user_id: "user3", start_time: "2024-03-20T12:00:00", end_time: "2024-03-20T12:20:00", duration: 20, page_views: 3 },
      ];
    },
  });

  // Fetch real user locations
  const { data: userLocations, isLoading: locationsLoading } = useQuery({
    queryKey: ["userLocations", timeframe],
    queryFn: async () => {
      return [
        { country: "India", region: "South", city: "Bangalore", users: 150, sessions: 200 },
        { country: "India", region: "North", city: "Delhi", users: 120, sessions: 180 },
        { country: "India", region: "West", city: "Mumbai", users: 100, sessions: 150 },
      ];
    },
  });

  // Fetch feature usage data
  const { data: featureUsage, isLoading: featuresLoading } = useQuery({
    queryKey: ["featureUsage", timeframe],
    queryFn: async () => {
      return [
        { feature: "Crop Prediction", usage_count: 500, success_rate: 85, avg_time_spent: 5.2 },
        { feature: "Soil Analysis", usage_count: 300, success_rate: 78, avg_time_spent: 3.8 },
        { feature: "Weather Forecast", usage_count: 400, success_rate: 92, avg_time_spent: 2.5 },
      ];
    },
  });

  // Calculate real metrics from sessions
  const calculateSessionMetrics = (sessions: UserSession[]) => {
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
    const avgSessionDuration = totalDuration / totalSessions;
    const totalPageViews = sessions.reduce((sum, session) => sum + session.page_views, 0);
    const avgPageViews = totalPageViews / totalSessions;

    return {
      totalSessions,
      avgSessionDuration,
      totalPageViews,
      avgPageViews
    };
  };

  // Colors for charts
  const COLORS = [
    '#16a34a', '#22c55e', '#4ade80', '#86efac', 
    '#bbf7d0', '#dcfce7', '#f0fdf4', '#059669',
    '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'
  ];
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (minutes: number) => {
    return `${Math.floor(minutes)}m ${Math.round((minutes % 1) * 60)}s`;
  };

  return (
    <AdminLayout title="Analytics Dashboard">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">Product Usage Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive insights on platform usage and user engagement
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={timeframe}
              onValueChange={(value: "day" | "week" | "month" | "all") => setTimeframe(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Engagement Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {engagementData?.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <span className={`p-1.5 rounded-full mr-2 ${
                  metric.trend === 'up' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingUpIcon className="h-4 w-4 text-red-600 dark:text-red-400 rotate-180" />
                  )}
                </span>
                {metric.metric}
              </CardTitle>
              <CardDescription>
                {metric.metric === 'Session Duration' ? 'Average time spent' : 
                 metric.metric === 'Bounce Rate' ? 'Percentage of single-page visits' :
                 metric.metric === 'Conversion Rate' ? 'Percentage of goal completions' :
                 'Number of active users'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-3xl font-bold">
                  {metric.metric === 'Session Duration' ? formatTime(metric.value) :
                   metric.metric === 'Bounce Rate' || metric.metric === 'Conversion Rate' ? 
                   formatPercentage(metric.value) : formatNumber(metric.value)}
                </div>
                <div className={`text-sm font-medium mt-1 ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.trend === 'up' ? '▲' : '▼'} {Math.abs(metric.change)}% from previous {timeframe}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Page Views Chart */}
      <Card className="mb-8 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Page Views Analysis</span>
            <div className="flex items-center space-x-2 text-sm">
              <Button
                variant={chartType === "bar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("bar")}
                className="p-1"
              >
                <ChartBarIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("line")}
                className="p-1"
              >
                <ChartLineIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === "area" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("area")}
                className="p-1"
              >
                <ActivityIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === "pie" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("pie")}
                className="p-1"
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Detailed analysis of page views and user engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pageViewsLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <ChartContainer config={{}} className="aspect-[4/3] md:aspect-[16/9]">
              <ResponsiveContainer width="100%" height="100%">
                {(() => {
                  switch (chartType) {
                    case "bar":
                      return (
                        <BarChart data={pageViewsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="title" angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="views" fill="#16a34a" name="Page Views" />
                        </BarChart>
                      );
                    case "line":
                      return (
                        <LineChart data={pageViewsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="title" angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="views" stroke="#16a34a" name="Page Views" />
                        </LineChart>
                      );
                    case "area":
                      return (
                        <AreaChart data={pageViewsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="title" angle={-45} textAnchor="end" height={60} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="views" stroke="#16a34a" fill="#16a34a" name="Page Views" />
                        </AreaChart>
                      );
                    case "pie":
                      return (
                        <PieChart>
                          <Pie
                            data={pageViewsData}
                            dataKey="views"
                            nameKey="title"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {pageViewsData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      );
                    default:
                      return null;
                  }
                })()}
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Add new analytics sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Sessions Analysis */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>User Sessions Analysis</CardTitle>
            <CardDescription>Detailed breakdown of user sessions and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</div>
                    <div className="text-2xl font-bold">{formatNumber(calculateSessionMetrics(userSessions || []).totalSessions)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Session Duration</div>
                    <div className="text-2xl font-bold">{formatTime(calculateSessionMetrics(userSessions || []).avgSessionDuration)}</div>
                  </div>
                </div>
                <div className="h-64">
                  <ChartContainer config={{}} className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userSessions?.slice(0, 7).reverse()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="start_time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="duration" stroke="#16a34a" name="Session Duration (min)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>User distribution across regions</CardDescription>
          </CardHeader>
          <CardContent>
            {locationsLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Countries</div>
                    <div className="text-2xl font-bold">{formatNumber(new Set(userLocations?.map(loc => loc.country)).size)}</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Regions</div>
                    <div className="text-2xl font-bold">{formatNumber(new Set(userLocations?.map(loc => loc.region)).size)}</div>
                  </div>
                </div>
                <div className="h-64">
                  <ChartContainer config={{}} className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userLocations?.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="country" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#16a34a" name="Users" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature Usage Analysis */}
      <Card className="mb-8 hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Feature Usage Analysis</CardTitle>
          <CardDescription>Detailed breakdown of feature usage and success rates</CardDescription>
        </CardHeader>
        <CardContent>
          {featuresLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <div className="space-y-6">
              {featureUsage?.map((feature, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{feature.feature}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatNumber(feature.usage_count)} uses
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Success Rate</span>
                      <span>{formatPercentage(feature.success_rate)}</span>
                    </div>
                    <Progress value={feature.success_rate} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span>Average Time Spent</span>
                      <span>{formatTime(feature.avg_time_spent)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAnalytics;
