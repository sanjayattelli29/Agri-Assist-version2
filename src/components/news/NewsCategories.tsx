
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsCategoriesProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export const NewsCategories = ({
  selectedCategory,
  onCategoryChange,
}: NewsCategoriesProps) => {
  const { t } = useLanguage();

  const categories = [
    { value: "general_agriculture", label: t("generalAgriculture") || "General Agriculture" },
    { value: "crop_production", label: t("cropProduction") || "Crop Production" },
    { value: "agritech", label: t("agritech") || "Agritech" },
    { value: "market_prices", label: t("marketPrices") || "Market Prices" },
    { value: "climate_updates", label: t("climateUpdates") || "Climate Updates" },
    { value: "government_schemes", label: t("governmentSchemes") || "Government Schemes" },
    { value: "farmer_stories", label: t("farmerStories") || "Farmer Stories" },
    { value: "agricultural_exports", label: t("agriculturalExports") || "Agricultural Exports" },
    { value: "rural_development", label: t("ruralDevelopment") || "Rural Development" },
    { value: "organic_farming", label: t("organicFarming") || "Organic Farming" },
    { value: "farm_mechanization", label: t("farmMechanization") || "Farm Mechanization" },
    { value: "agriculture_education", label: t("agricultureEducation") || "Agriculture Education" },
    { value: "livestock_farming", label: t("livestockFarming") || "Livestock Farming" },
    { value: "irrigation_news", label: t("irrigationNews") || "Irrigation News" },
    { value: "agricultural_research", label: t("agriculturalResearch") || "Agricultural Research" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <ScrollArea className="w-full pb-3" scrollHideDelay={0}>
        <div className="min-w-full w-max pb-4">
          <Tabs
            defaultValue={selectedCategory}
            onValueChange={onCategoryChange}
            className="w-max"
          >
            <TabsList className="w-max bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg flex flex-nowrap overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="px-4 py-2 rounded-md whitespace-nowrap data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </ScrollArea>
    </motion.div>
  );
};
