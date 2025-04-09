
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboardCard from "@/components/admin/AdminDashboardCard";
import MLAnalysisBanner from "@/components/admin/MLAnalysisBanner";
import { 
  Crop, 
  Droplet, 
  Image, 
  SprayCanIcon, 
  Sprout, 
  MessageCircle,
  LineChart
} from "lucide-react";

const AdminDashboard = () => {
  const adminCards = [
    {
      title: "Crop Prediction",
      description: "Manage crop prediction data and models",
      icon: Crop,
      href: "/admin/crop-prediction",
    },
    {
      title: "Soil Requirements",
      description: "Update soil parameters for different crops",
      icon: Sprout,
      href: "/admin/soil-requirements",
    },
    {
      title: "Crop Rotation",
      description: "Manage crop rotation rules and recommendations",
      icon: Crop,
      href: "/admin/crop-rotation",
    },
    {
      title: "Pesticide Guide",
      description: "Update pesticide products and recommendations",
      icon: SprayCanIcon,
      href: "/admin/pesticide-guide",
    },
    {
      title: "Fertilizer Guide",
      description: "Manage fertilizer products and recommendations",
      icon: Droplet,
      href: "/admin/fertilizer-guide",
    },
    {
      title: "Crop Images",
      description: "Upload and manage crop prediction images",
      icon: Image,
      href: "/admin/crop-images",
    },
    {
      title: "Chatbot Data",
      description: "Manage agricultural knowledge for the chatbot",
      icon: MessageCircle,
      href: "/admin/chatbot-data",
    },
    {
      title: "Analytics",
      description: "View usage metrics and data insights",
      icon: LineChart,
      href: "/admin/analytics",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <MLAnalysisBanner />

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card, index) => (
          <AdminDashboardCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            href={card.href}
          />
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
