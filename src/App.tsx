import { Route, Routes, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CropPrediction from "./pages/CropPrediction";
import SoilRequirements from "./pages/SoilRequirements";
import CropRotation from "./pages/CropRotation";
import PesticideGuide from "./pages/PesticideGuide";
import FertilizerGuide from "./pages/FertilizerGuide";
import Insights from "./pages/Insights";
import News from "./pages/News";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import LanguageProvider from "./contexts/LanguageProvider";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCropPrediction from "./pages/admin/AdminCropPrediction";
import AdminSoilRequirements from "./pages/admin/AdminSoilRequirements";
import AdminCropRotation from "./pages/admin/AdminCropRotation";
import AdminPesticideGuide from "./pages/admin/AdminPesticideGuide";
import AdminFertilizerGuide from "./pages/admin/AdminFertilizerGuide";
import AdminCropImageManager from "./pages/admin/AdminCropImageManager";
import AdminChatbotData from "./pages/admin/AdminChatbotData";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import ChatbotPage from "./pages/ChatbotPage";
import AdminRoute from "./components/admin/AdminRoute";
import FloatingChatButton from "./components/FloatingChatButton";

function App() {
  const location = useLocation();
  const showFloatingChat = location.pathname !== '/chatbot'; // Hide on chatbot page
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="agri-assist-theme">
      <LanguageProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crop-prediction" element={<CropPrediction />} />
            <Route path="/soil-requirements" element={<SoilRequirements />} />
            <Route path="/crop-rotation" element={<CropRotation />} />
            <Route path="/pesticide-guide" element={<PesticideGuide />} />
            <Route path="/fertilizer-guide" element={<FertilizerGuide />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/news" element={<News />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/crop-prediction" element={<AdminRoute><AdminCropPrediction /></AdminRoute>} />
            <Route path="/admin/soil-requirements" element={<AdminRoute><AdminSoilRequirements /></AdminRoute>} />
            <Route path="/admin/crop-rotation" element={<AdminRoute><AdminCropRotation /></AdminRoute>} />
            <Route path="/admin/pesticide-guide" element={<AdminRoute><AdminPesticideGuide /></AdminRoute>} />
            <Route path="/admin/fertilizer-guide" element={<AdminRoute><AdminFertilizerGuide /></AdminRoute>} />
            <Route path="/admin/crop-images" element={<AdminRoute><AdminCropImageManager /></AdminRoute>} />
            <Route path="/admin/chatbot-data" element={<AdminRoute><AdminChatbotData /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          {showFloatingChat && <FloatingChatButton />}
          <Toaster />
        </AdminAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
