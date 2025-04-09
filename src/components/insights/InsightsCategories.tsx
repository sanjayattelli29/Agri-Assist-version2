
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InsightsCategoriesProps {
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export const InsightsCategories = ({
  selectedCategory,
  onCategoryChange,
}: InsightsCategoriesProps) => {
  const { t } = useLanguage();

  const categories = [
    { value: "crop_productivity", label: t("cropProductivity") || "Crop Productivity" },
    { value: "sustainable_farming", label: t("sustainableFarming") || "Sustainable Farming" },
    { value: "organic_farming", label: t("organicFarming") || "Organic Farming" },
    { value: "crop_diseases", label: t("cropDiseases") || "Crop Diseases" },
    { value: "water_management", label: t("waterManagement") || "Water Management" },
    { value: "soil_health", label: t("soilHealth") || "Soil Health" },
    { value: "climate_adaptations", label: t("climateAdaptations") || "Climate Adaptations" },
    { value: "modern_techniques", label: t("modernTechniques") || "Modern Techniques" },
    { value: "market_trends", label: t("marketTrends") || "Market Trends" },
    { value: "government_policies", label: t("governmentPolicies") || "Government Policies" },
    { value: "farm_equipment", label: t("farmEquipment") || "Farm Equipment" },
    { value: "crop_rotation", label: t("cropRotation") || "Crop Rotation" },
    { value: "pest_management", label: t("pestManagement") || "Pest Management" },
    { value: "fertilizer_optimization", label: t("fertilizerOptimization") || "Fertilizer Optimization" },
    { value: "crop_varieties", label: t("cropVarieties") || "Crop Varieties" },
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
                  className="px-4 py-2 rounded-md whitespace-nowrap data-[state=active]:bg-amber-500 data-[state=active]:text-white"
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
