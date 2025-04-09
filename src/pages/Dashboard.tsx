
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOptions } from "@/components/dashboard/DashboardOptions";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { WeatherDisplay } from "@/components/dashboard/WeatherDisplay";
import { SidePanel } from "@/components/dashboard/SidePanel";
import { useState } from "react";

const Dashboard = () => {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 dark:text-white">
      <DashboardHeader onMenuClick={toggleSidePanel} />
      
      <SidePanel isOpen={sidePanelOpen} onClose={() => setSidePanelOpen(false)} />
      
      <div className="max-w-6xl mx-auto py-4 px-4">
        <WeatherDisplay />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <DashboardOptions />
      </div>
      
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;
