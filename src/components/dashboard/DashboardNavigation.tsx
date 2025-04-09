
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface NavigationItem {
  trigger: string;
  content: {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
  }[];
}

export const DashboardNavigation = () => {
  const { t } = useLanguage();
  
  const navigationItems: NavigationItem[] = [
    {
      trigger: t("prediction"),
      content: [
        {
          title: t("cropPrediction"),
          description: t("cropPrediction"),
          icon: null, // We'll only use the icon name in the component
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
                          {/* We'll render the icon in the actual component usage */}
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
