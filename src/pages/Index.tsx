
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिंदी" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
];

// Translation map for welcome text and subtitles
const welcomeTranslations = {
  welcomeTitle: {
    en: "Agri Assist",
    hi: "कृषि सहायक",
    te: "వ్యవసాయ సహాయకుడు",
    kn: "ಕೃಷಿ ಸಹಾಯಕ",
    ml: "കൃഷി സഹായി",
  },
  welcomeSubtitle: {
    en: "Your Smart Farming Companion",
    hi: "आपका स्मार्ट कृषि साथी",
    te: "మీ స్మార్ట్ వ్యవసాయ సహచరుడు",
    kn: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯಕ",
    ml: "നിങ്ങളുടെ സ്മാർട്ട് കൃഷി സഹായി",
  },
  welcomeMessage: {
    en: "Welcome to Your Agricultural Assistant",
    hi: "आपके कृषि सहायक में आपका स्वागत है",
    te: "మీ వ్యవసాయ సహాయకుడికి స్వాగతం",
    kn: "ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ",
    ml: "നിങ്ങളുടെ കാർഷിക സഹായിയിലേക്ക് സ്വാഗതം",
  },
  description: {
    en: "Get personalized crop predictions, disease detection, and pesticide recommendations in your preferred language.",
    hi: "अपनी पसंदीदा भाषा में व्यक्तिगत फसल भविष्यवाणियां, रोग पहचान और कीटनाशक सिफारिशें प्राप्त करें।",
    te: "మీకు నచ్చిన భాషలో వ్యక్తిగతీకరించిన పంట అంచనాలు, వ్యాధి గుర్తింపు మరియు క్రిమిసంహారక సిఫార్సులను పొందండి.",
    kn: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯಲ್ಲಿ ವೈಯಕ್ತಿಕ ಬೆಳೆ ಭವಿಷ್ಯವಾಣಿಗಳು, ರೋಗ ಪತ್ತೆ ಮತ್ತು ಕೀಟನಾಶಕ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ.",
    ml: "നിങ്ങളുടെ ഇഷ്ടമുള്ള ഭാഷയിൽ വ്യക്തിഗത വിള പ്രവചനങ്ങൾ, രോഗ നിർണ്ണയം, കീടനാശിനി ശുപാർശകൾ എന്നിവ നേടുക.",
  },
  select: {
    en: "Select",
    hi: "चयन करें",
    te: "ఎంచుకోండి",
    kn: "ಆಯ್ಕೆಮಾಡಿ",
    ml: "തിരഞ്ഞെടുക്കുക",
  },
  footerTitle: {
    en: "Agri Assist",
    hi: "कृषि सहायक",
    te: "వ్యవసాయ సహాయకుడు",
    kn: "ಕೃಷಿ ಸಹಾಯಕ",
    ml: "കൃഷി സഹായി",
  },
  footerSubtitle: {
    en: "Your Smart Farming Companion",
    hi: "आपका स्मार्ट कृषि साथी",
    te: "మీ స్మార్ట్ వ్యవసాయ సహచరుడు",
    kn: "ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯಕ",
    ml: "നിങ്ങളുടെ സ്മാർട്ട് കൃഷി സഹായി",
  },
  contactUs: {
    en: "Contact Us",
    hi: "संपर्क करें",
    te: "మమ్మల్ని సంప్రదించండి",
    kn: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
    ml: "ഞങ്ങളെ സമ്പർക്കിക്കുക",
  },
  email: {
    en: "Email: support@agriassist.com",
    hi: "ईमेल: support@agriassist.com",
    te: "ఇమెయిల్: support@agriassist.com",
    kn: "ಇಮೇಲ್: support@agriassist.com", 
    ml: "ഇമെയിൽ: support@agriassist.com",
  },
  phone: {
    en: "Phone: +91-5962-241022",
    hi: "फोन: +91-5962-241022",
    te: "ఫోన్: +91-5962-241022",
    kn: "ಫೋನ್: +91-5962-241022",
    ml: "ഫോൺ: +91-5962-241022",
  },
  helpline: {
    en: "Helpline",
    hi: "हेल्पलाइन",
    te: "సహాయ కేంద్రం",
    kn: "ಸಹಾಯವಾಣಿ",
    ml: "ഹെൽപ്‌ലൈൻ",
  },
  tollFree: {
    en: "Toll-Free: 1800-180-2311",
    hi: "टोल-फ्री: 1800-180-2311",
    te: "టోల్ ఫ్రీ: 1800-180-2311",
    kn: "ಟೋಲ್-ಫ್ರೀ: 1800-180-2311",
    ml: "ടോൾ ഫ്രീ: 1800-180-2311",
  },
  whatsapp: {
    en: "WhatsApp: +91-9997023062",
    hi: "व्हाट्सएप: +91-9997023062",
    te: "వాట్సాప్: +91-9997023062",
    kn: "ವಾಟ್ಸಾಪ್: +91-9997023062",
    ml: "വാട്സ്ആപ്പ്: +91-9997023062",
  },
  copyright: {
    en: "© 2025 Agri Assist. All rights reserved.",
    hi: "© 2025 कृषि सहायक. सर्वाधिकार सुरक्षित।",
    te: "© 2025 వ్యవసాయ సహాయకుడు. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.",
    kn: "© 2025 ಕೃಷಿ ಸಹಾಯಕ. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    ml: "© 2025 കൃഷി സഹായി. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തമാണ്.",
  },
  loading: {
    en: "Loading...",
    hi: "लोड हो रहा है...",
    te: "లోడ్ అవుతోంది...",
    kn: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    ml: "ലോഡുചെയ്യുന്നു...",
  }
};

const Index = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure language is set to a valid value on component mount
    if (!language || !languages.some(lang => lang.code === language)) {
      setLanguage("en");
    }
    setIsLoading(false);
  }, [language, setLanguage]);

  const handleLanguageSelect = (langCode: "en" | "hi" | "te" | "kn" | "ml") => {
    setLanguage(langCode);
    setTimeout(() => navigate("/dashboard"), 500);
  };

  const getTranslation = (key: keyof typeof welcomeTranslations) => {
    return welcomeTranslations[key][language as keyof typeof welcomeTranslations[typeof key]] || welcomeTranslations[key].en;
  };

  // Render loading state while language is being set
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">{getTranslation('loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-950 dark:text-white">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            {getTranslation('welcomeTitle')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {getTranslation('welcomeSubtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-4xl mx-auto mb-12">
          {languages.map((lang, index) => (
            <motion.div
              key={lang.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  language === lang.code
                    ? "border-green-500 bg-green-50 dark:bg-green-900"
                    : "border-gray-200 bg-white dark:bg-gray-800"
                }`}
                onClick={() => handleLanguageSelect(lang.code as "en" | "hi" | "te" | "kn" | "ml")}
              >
                <CardHeader>
                  <CardTitle className="text-xl">{lang.native}</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    {lang.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant={language === lang.code ? "default" : "outline"}
                    className="w-full"
                  >
                    {getTranslation('select')}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            {getTranslation('welcomeMessage')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {getTranslation('description')}
          </p>
        </motion.div>
      </div>

      {/* Add Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">{getTranslation('footerTitle')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{getTranslation('footerSubtitle')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">{getTranslation('contactUs')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{getTranslation('email')}</p>
              <p className="text-gray-600 dark:text-gray-300">{getTranslation('phone')}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">{getTranslation('helpline')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{getTranslation('tollFree')}</p>
              <p className="text-gray-600 dark:text-gray-300">{getTranslation('whatsapp')}</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
            <p>{getTranslation('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
