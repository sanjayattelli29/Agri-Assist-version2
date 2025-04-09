
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { NewsHero } from "@/components/news/NewsHero";
import { NewsCategories } from "@/components/news/NewsCategories";
import { NewsList } from "@/components/news/NewsList";
import { NewsLoading } from "@/components/news/NewsLoading";
import { NewsError } from "@/components/news/NewsError";
import { NewsTickerTape } from "@/components/news/NewsTickerTape";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SidePanel } from "@/components/dashboard/SidePanel";

type News = {
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: string;
  readTime: string;
  url?: string;
};

const fetchNews = async (category?: string): Promise<{
  news: News[];
  category: string;
  headlines: string[];
  generatedAt: string;
}> => {
  const { data, error } = await supabase.functions.invoke("get-agri-news", {
    body: { category },
  });

  if (error) {
    throw new Error(`Error fetching news: ${error.message}`);
  }

  return data;
};

const News = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  // Fetch news with React Query
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["agri-news", selectedCategory],
    queryFn: () => fetchNews(selectedCategory),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (data?.headlines && data.headlines.length > 0) {
      setHeadlines(data.headlines);
    }
  }, [data]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("News refreshed!");
  };
  
  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 dark:text-white">
      <DashboardHeader onMenuClick={toggleSidePanel} />
      <SidePanel isOpen={sidePanelOpen} onClose={() => setSidePanelOpen(false)} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <NewsHero 
          onRefresh={handleRefresh} 
          category={data?.category} 
        />

        {headlines.length > 0 && (
          <NewsTickerTape headlines={headlines} />
        )}
        
        <NewsCategories 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {isLoading ? (
          <NewsLoading />
        ) : error ? (
          <NewsError error={error as Error} onRetry={refetch} />
        ) : (
          <NewsList news={data?.news || []} />
        )}
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default News;
