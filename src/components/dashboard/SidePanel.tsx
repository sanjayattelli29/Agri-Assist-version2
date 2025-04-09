
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, ChevronRight, MessageCircle, Lightbulb, Newspaper, Search, FlaskConical, CloudRain, Languages, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidePanel = ({ isOpen, onClose }: SidePanelProps) => {
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  
  // Close the panel when Escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);
  
  // Prevent body scrolling when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as "en" | "hi" | "te" | "kn" | "ml");
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          {/* Side panel */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-gray-900 z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b dark:border-gray-800">
              <h3 className="font-semibold text-lg">Agri Assist</h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <div className="space-y-6">
                  {/* Navigation section */}
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                      {t("navigation")}
                    </h4>
                    
                    <div className="space-y-1">
                      <Link to="/" onClick={onClose} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="flex items-center">
                          <Home className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                          <span>{t("dashboard")}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      
                      <Link to="/chatbot" onClick={onClose} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="flex items-center">
                          <MessageCircle className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                          <span>{t("chatbot")}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      
                      <Link to="/insights" onClick={onClose} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="flex items-center">
                          <Lightbulb className="h-5 w-5 mr-3 text-amber-600 dark:text-amber-400" />
                          <span>{t("insights")}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      
                      <Link to="/news" onClick={onClose} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="flex items-center">
                          <Newspaper className="h-5 w-5 mr-3 text-green-600 dark:text-green-400" />
                          <span>{t("news")}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      
                      <Link to="/crop-prediction" onClick={onClose} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="flex items-center">
                          <Search className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400" />
                          <span>{t("cropPrediction")}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      
                      <Link to="/soil-requirements" onClick={onClose} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="flex items-center">
                          <FlaskConical className="h-5 w-5 mr-3 text-orange-600 dark:text-orange-400" />
                          <span>{t("soilRequirements")}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      
                      <Link to="/crop-rotation" onClick={onClose} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        <div className="flex items-center">
                          <CloudRain className="h-5 w-5 mr-3 text-teal-600 dark:text-teal-400" />
                          <span>{t("cropRotation")}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Language section */}
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                      {t("language")}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={language === "en" ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleLanguageChange("en")}
                      >
                        <Languages className="h-4 w-4 mr-2" />
                        English
                      </Button>
                      <Button 
                        variant={language === "hi" ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleLanguageChange("hi")}
                      >
                        <Languages className="h-4 w-4 mr-2" />
                        हिंदी
                      </Button>
                      <Button 
                        variant={language === "te" ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleLanguageChange("te")}
                      >
                        <Languages className="h-4 w-4 mr-2" />
                        తెలుగు
                      </Button>
                      <Button 
                        variant={language === "kn" ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleLanguageChange("kn")}
                      >
                        <Languages className="h-4 w-4 mr-2" />
                        ಕನ್ನಡ
                      </Button>
                      <Button 
                        variant={language === "ml" ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => handleLanguageChange("ml")}
                      >
                        <Languages className="h-4 w-4 mr-2" />
                        മലയാളം
                      </Button>
                    </div>
                  </div>
                  
                  {/* Appearance section */}
                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                      {t("appearance")}
                    </h4>
                    <div className="flex gap-2">
                      <Button 
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        className="flex-1 justify-center"
                        onClick={() => handleThemeChange("light")}
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        {t("light")}
                      </Button>
                      <Button 
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        className="flex-1 justify-center"
                        onClick={() => handleThemeChange("dark")}
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        {t("dark")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            {/* Footer with app version */}
            <div className="p-4 border-t dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
              <p>Agri Assist v1.0.1</p>
              <p className="mt-1">©2025 - All rights reserved</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
