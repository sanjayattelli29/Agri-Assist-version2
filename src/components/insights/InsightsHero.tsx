
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightsHeroProps {
  onRefresh: () => void;
  category?: string;
}

export const InsightsHero = ({ onRefresh, category }: InsightsHeroProps) => {
  const { t, language } = useLanguage();
  
  const formatCategory = (cat?: string) => {
    if (!cat) return "";
    return cat.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const heroText = {
    en: "Agricultural Insights for India",
    hi: "भारत के लिए कृषि अंतर्दृष्टि",
    te: "భారతదేశానికి వ్యవసాయ అంతర్దృష్టి",
    kn: "ಭಾರತಕ್ಕಾಗಿ ಕೃಷಿ ಒಳನೋಟಗಳು",
    ml: "ഇന്ത്യയ്ക്കുള്ള കാർഷിക ഉൾക്കാഴ്ചകൾ"
  };

  const categoryText = {
    en: category ? `Exploring ${formatCategory(category)}` : "Discover Agricultural Knowledge",
    hi: category ? `${formatCategory(category)} का अन्वेषण` : "कृषि ज्ञान की खोज करें",
    te: category ? `${formatCategory(category)} అన్వేషించడం` : "వ్యవసాయ జ్ఞానాన్ని కనుగొనండి",
    kn: category ? `${formatCategory(category)} ಅನ್ವೇಷಿಸುವುದು` : "ಕೃಷಿ ಜ್ಞಾನವನ್ನು ಅನ್ವೇಷಿಸಿ",
    ml: category ? `${formatCategory(category)} പര്യവേക്ഷണം ചെയ്യുന്നു` : "കാർഷിക അറിവ് കണ്ടെത്തുക"
  };
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 dark:from-amber-900 dark:to-orange-950 mb-8">
      <div className="absolute inset-0 bg-grid-white/20 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.5),rgba(255,255,255,0))]"></div>
      <div className="relative px-6 py-12 sm:px-12 sm:py-16 text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          {heroText[language as keyof typeof heroText] || heroText.en}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xl text-white/80 max-w-3xl"
        >
          {categoryText[language as keyof typeof categoryText] || categoryText.en}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Button 
            onClick={onRefresh}
            variant="outline"
            className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("refreshInsights") || "Refresh Insights"}
          </Button>
        </motion.div>
        
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-orange-500/30 blur-3xl"></div>
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-amber-500/30 blur-3xl"></div>
      </div>
    </div>
  );
};
