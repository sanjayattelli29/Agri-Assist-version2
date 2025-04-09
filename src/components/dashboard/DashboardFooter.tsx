import { Link } from "react-router-dom";
import { Heart, Github, Instagram, Linkedin, Palette, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export const DashboardFooter = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 px-4 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-semibold text-green-700 dark:text-green-400 text-lg">
            Agri Assist
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t("poweredBy")} © 2025
          </p>
        </div>
        
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/terms" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            {t("termsOfService")}
          </Link>
          <Link to="/privacy" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            {t("privacyPolicy")}
          </Link>
          <Link to="/about" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            {t("aboutUs")}
          </Link>
          <Link to="/contact" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">
            {t("contactUs")}
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/sanjayattelli29" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
          <a 
            href="https://www.instagram.com/editwithsanjay/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a 
            href="https://www.behance.net/attellisanjay/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <Palette className="h-5 w-5" />
          </a>
          <a 
            href="https://www.linkedin.com/in/attelli-sanjay-kumar/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            asChild
          >
            <Link to="/admin">
              <Shield className="h-4 w-4 mr-2" />
              Admin Panel
            </Link>
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <span>Developed with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" />
            <span>by</span>
            <a 
              href="https://designwithsanjay.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-1 text-green-600 dark:text-green-400 hover:underline"
            >
              designwithsanjay
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
