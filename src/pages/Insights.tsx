
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { InsightsList } from "@/components/insights/InsightsList";
import { InsightsHero } from "@/components/insights/InsightsHero";
import { InsightsCategories } from "@/components/insights/InsightsCategories";
import { InsightsLoading } from "@/components/insights/InsightsLoading";
import { InsightsError } from "@/components/insights/InsightsError";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidePanel } from "@/components/dashboard/SidePanel";

type Insight = {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  source: string;
};

const fetchInsights = async (category?: string): Promise<{
  insights: Insight[];
  category: string;
  generatedAt: string;
}> => {
  const { data, error } = await supabase.functions.invoke("get-crop-insights", {
    body: { category },
  });

  if (error) {
    throw new Error(`Error fetching insights: ${error.message}`);
  }

  return data;
};

const Insights = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  // Fetch insights with React Query
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["insights", selectedCategory],
    queryFn: () => fetchInsights(selectedCategory),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Insights refreshed!");
  };
  
  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-amber-950 dark:to-gray-950 dark:text-white">
      <DashboardHeader onMenuClick={toggleSidePanel} />
      <SidePanel isOpen={sidePanelOpen} onClose={() => setSidePanelOpen(false)} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <InsightsHero 
          onRefresh={handleRefresh} 
          category={data?.category} 
        />
        
        <InsightsCategories 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {isLoading ? (
          <InsightsLoading />
        ) : error ? (
          <InsightsError error={error} onRetry={refetch} />
        ) : (
          <InsightsList insights={data?.insights || []} />
        )}
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default Insights;
