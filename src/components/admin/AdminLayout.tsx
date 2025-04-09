
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Button } from "@/components/ui/button";
import { 
  Crop, 
  LeafyGreen, 
  SprayCanIcon, 
  Sprout, 
  Droplet, 
  LayoutDashboard, 
  LogOut,
  Menu,
  X,
  LineChart,
  Image,
  MessageCircle
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Crop Prediction", href: "/admin/crop-prediction", icon: Crop },
    { name: "Soil Requirements", href: "/admin/soil-requirements", icon: Sprout },
    { name: "Crop Rotation", href: "/admin/crop-rotation", icon: Crop },
    { name: "Pesticide Guide", href: "/admin/pesticide-guide", icon: SprayCanIcon },
    { name: "Fertilizer Guide", href: "/admin/fertilizer-guide", icon: Droplet },
    { name: "Crop Images", href: "/admin/crop-images", icon: Image },
    { name: "Chatbot Data", href: "/admin/chatbot-data", icon: MessageCircle },
    { name: "Analytics", href: "/admin/analytics", icon: LineChart },
  ];

  const NavLink = ({ item }: { item: typeof navItems[0] }) => (
    <Link
      to={item.href}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-green-100 dark:hover:bg-green-900"
      onClick={() => setOpen(false)}
    >
      <item.icon className="w-5 h-5" />
      {item.name}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-semibold">Admin Panel</h2>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <NavLink key={item.href} item={item} />
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r">
          <div className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
