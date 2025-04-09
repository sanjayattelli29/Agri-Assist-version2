
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ArrowRight, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

// Define the NavigationItem interface
interface NavigationItem {
  trigger: string;
  content: {
    title: string;
    description: string;
    icon: React.ComponentType | null;
    href: string;
  }[];
}

export const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoForward = () => {
    navigate(1);
  };
  
  const welcomeText = {
    en: "Welcome to Agri Assist",
    hi: "कृषि सहायक में आपका स्वागत है",
    te: "అగ్రి అసిస్ట్‌కి స్వాగతం",
    kn: "ಕೃಷಿ ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ",
    ml: "അഗ്രി അസിസ്റ്റിലേക്ക് സ്വാഗതം"
  };

  return (
    <>
      <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden mr-2" 
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            
            <div className="hidden md:block">
              <DashboardNavigation />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack}
              className="hidden sm:flex"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("back") || "Back"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoForward}
              className="hidden sm:flex"
            >
              {t("forward") || "Forward"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-8 mt-6 px-2"
      >
        {welcomeText[language as keyof typeof welcomeText] || welcomeText.en}
      </motion.h1>
    </>
  );
};

export const DashboardNavigation = () => {
  const { t } = useLanguage();
  
  const navigationItems: NavigationItem[] = [
    {
      trigger: t("prediction"),
      content: [
        {
          title: t("cropPrediction"),
          description: t("cropPrediction"),
          icon: null,
          href: "/crop-prediction",
        },
        {
          title: t("pesticideGuide"),
          description: t("pesticideGuide"),
          icon: null,
          href: "/pesticide-guide",
        },
        {
          title: t("fertilizerGuide"),
          description: t("fertilizerGuide"),
          icon: null,
          href: "/fertilizer-guide",
        },
      ],
    },
    {
      trigger: t("insights"),
      content: [
        {
          title: t("insights"),
          description: t("insights"),
          icon: null,
          href: "/insights",
        },
      ],
    },
    {
      trigger: t("soilRequirements"),
      content: [
        {
          title: t("soilRequirements"),
          description: t("soilRequirements"),
          icon: null,
          href: "/soil-requirements",
        },
        {
          title: t("cropRotation"),
          description: t("cropRotation"),
          icon: null,
          href: "/crop-rotation",
        },
      ],
    },
    {
      trigger: t("news"),
      content: [
        {
          title: t("news"),
          description: t("news"),
          icon: null,
          href: "/news",
        },
      ],
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.trigger}>
            <NavigationMenuTrigger className="text-gray-700 dark:text-gray-200">
              {item.trigger}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {item.content.map((content) => (
                  <li key={content.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={content.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium leading-none">
                            {content.title}
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {content.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
