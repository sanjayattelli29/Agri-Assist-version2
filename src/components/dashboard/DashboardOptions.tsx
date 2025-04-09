
import { useLanguage } from "@/contexts/LanguageContext";
import { Crop, LeafyGreen, SprayCanIcon, Sprout, Droplet, MessageCircle } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardOptions = () => {
  const { t } = useLanguage();
  
  const options = [
    {
      title: t("cropPrediction"),
      description: t("cropPredictionDesc"),
      icon: Crop,
      href: "/crop-prediction",
    },
    {
      title: t("chatWithUs"),
      description: t("chatWithUsDesc"),
      icon: MessageCircle,
      href: "/chatbot",
    },
    {
      title: t("pesticideGuide"),
      description: t("pesticideGuideDesc"),
      icon: SprayCanIcon,
      href: "/pesticide-guide",
    },
    {
      title: t("fertilizerGuide"),
      description: t("fertilizerGuideDesc"),
      icon: Droplet,
      href: "/fertilizer-guide",
    },
    {
      title: t("soilRequirements"),
      description: t("soilRequirementsDesc"),
      icon: Sprout,
      href: "/soil-requirements",
    },
    {
      title: t("cropRotation"),
      description: t("cropRotationDesc"),
      icon: Crop,
      href: "/crop-rotation",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {options.map((option, index) => (
        <DashboardCard
          key={option.href}
          title={option.title}
          description={option.description}
          icon={option.icon}
          href={option.href}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};
