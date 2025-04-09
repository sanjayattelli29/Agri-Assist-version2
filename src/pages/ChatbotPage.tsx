
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import WhatsAppChatBot from "@/components/WhatsAppChatBot";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const ChatbotPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleGoForward = () => {
    navigate(1);
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950">
      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost"
              onClick={handleGoBack}
              className="mr-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t("back") || "Back"}
            </Button>
            <Link 
              to="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {t("backToDashboard") || "Back to Dashboard"}
            </Link>
          </div>
          <Button 
            variant="ghost"
            onClick={handleGoForward}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            {t("forward") || "Forward"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Chat with Us</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Ask questions about farming and agriculture to get expert assistance</p>
        </div>
        
        <div className="w-full mx-auto">
          <WhatsAppChatBot />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
