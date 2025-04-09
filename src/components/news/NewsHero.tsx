
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsHeroProps {
  onRefresh: () => void;
  category?: string;
}

export const NewsHero = ({ onRefresh, category }: NewsHeroProps) => {
  const { t, language } = useLanguage();
  
  const formatCategory = (cat?: string) => {
    if (!cat) return "";
    return cat.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const heroText = {
    en: "Agricultural News from India",
    hi: "भारत से कृषि समाचार",
    te: "భారతదేశం నుండి వ్యవసాయ వార్తలు",
    kn: "ಭಾರತದಿಂದ ಕೃಷಿ ಸುದ್ದಿಗಳು",
    ml: "ഇന്ത്യയിൽ നിന്നുള്ള കാർഷിക വാർത്തകൾ"
  };

  const categoryText = {
    en: category ? `Latest ${formatCategory(category)} News` : "Stay Updated with Agricultural Developments",
    hi: category ? `नवीनतम ${formatCategory(category)} समाचार` : "कृषि विकास से अपडेट रहें",
    te: category ? `తాజా ${formatCategory(category)} వార్తలు` : "వ్యవసాయ అభివృద్ధులతో నవీకరించబడి ఉండండి",
    kn: category ? `ಇತ್ತೀಚಿನ ${formatCategory(category)} ಸುದ್ದಿಗಳು` : "ಕೃಷಿ ಅಭಿವೃದ್ಧಿಗಳೊಂದಿಗೆ ನವೀಕರಿಸಿ",
    ml: category ? `ഏറ്റവും പുതിയ ${formatCategory(category)} വാർത്തകൾ` : "കാർഷിക വികസനങ്ങളിൽ അപ്ഡേറ്റ് ചെയ്യുക"
  };
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 dark:from-green-800 dark:to-emerald-950 mb-8">
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
            {t("refreshNews") || "Refresh News"}
          </Button>
        </motion.div>
        
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/30 blur-3xl"></div>
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-green-500/30 blur-3xl"></div>
      </div>
    </div>
  );
};
