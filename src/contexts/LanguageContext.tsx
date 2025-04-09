import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = "en" | "hi" | "te" | "kn" | "ml";

export interface TranslationDictionary {
  chatWithUs?: string;
  chatWithUsDesc?: string;
  cropPrediction: string;
  cropPredictionDesc: string;
  diseaseDetection?: string;
  diseaseDetectionDesc?: string;
  pesticideGuide: string;
  pesticideGuideDesc: string;
  fertilizerGuide: string;
  fertilizerGuideDesc: string;
  soilRequirements: string;
  soilRequirementsDesc: string;
  cropRotation: string;
  cropRotationDesc: string;
  insights: string;
  prediction: string;
  news: string;
  helplineTitle: string;
  tollFree: string;
  phone: string;
  whatsapp: string;
  whatsappText: string;
  companyInfoTitle: string;
  companyDescription1: string;
  companyDescription2: string;
  companyDescription3: string;
  
  backToDashboard: string;
  error: string;
  errorFetchingData: string;
  cropPredictionManagement: string;
  cropName: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  temperature: string;
  humidity: string;
  ph: string;
  rainfall: string;
  uploading: string;
  upload: string;
  refresh: string;
  loading: string;
  
  back: string;
  forward: string;
  
  cropProductivity: string;
  sustainableFarming: string;
  organicFarming: string;
  cropDiseases: string;
  waterManagement: string;
  soilHealth: string;
  climateAdaptations: string;
  modernTechniques: string;
  marketTrends: string;
  governmentPolicies: string;
  farmEquipment: string;
  pestManagement: string;
  fertilizerOptimization: string;
  cropVarieties: string;
  refreshInsights: string;
  
  generalAgriculture: string;
  cropProduction: string;
  agritech: string;
  marketPrices: string;
  climateUpdates: string;
  governmentSchemes: string;
  farmerStories: string;
  agriculturalExports: string;
  ruralDevelopment: string;
  farmMechanization: string;
  agricultureEducation: string;
  livestockFarming: string;
  irrigationNews: string;
  agriculturalResearch: string;
  refreshNews: string;
  
  dashboard: string;
  chatbot: string;
  navigation: string;
  language: string;
  appearance: string;
  light: string;
  dark: string;
  poweredBy: string;
  termsOfService: string;
  privacyPolicy: string;
  aboutUs: string;
  contactUs: string;
}

const translations: Record<Language, TranslationDictionary> = {
  en: {
    chatWithUs: "Chat with Agri Expert",
    chatWithUsDesc: "Get quick answers to all your farming questions from our AI assistant",
    cropPrediction: "Crop Prediction",
    cropPredictionDesc: "Predict which crop to grow based on soil and weather",
    pesticideGuide: "Pesticide Guide",
    pesticideGuideDesc: "Find the right pesticide for your specific needs",
    fertilizerGuide: "Fertilizer Guide",
    fertilizerGuideDesc: "Discover the ideal fertilizer for your crops",
    soilRequirements: "Soil Requirements",
    soilRequirementsDesc: "Learn about the soil requirements for different crops",
    cropRotation: "Crop Rotation",
    cropRotationDesc: "Optimize your land use with proper crop rotation",
    insights: "Insights",
    prediction: "Prediction",
    news: "News",
    helplineTitle: "Farmer Helpline",
    tollFree: "Toll Free: 1800-180-1551",
    phone: "Phone: +91 11-25846391 to 95",
    whatsapp: "WhatsApp",
    whatsappText: "9599780225",
    companyInfoTitle: "About Us",
    companyDescription1: "We're dedicated to empowering farmers with technology.",
    companyDescription2: "Our AI-powered tools help make better agricultural decisions.",
    companyDescription3: "Serving Indian farmers since 2023.",
    
    backToDashboard: "Back to Dashboard",
    error: "Error",
    errorFetchingData: "Error fetching data",
    cropPredictionManagement: "Crop Prediction Management",
    cropName: "Crop Name",
    nitrogen: "Nitrogen",
    phosphorus: "Phosphorus",
    potassium: "Potassium",
    temperature: "Temperature",
    humidity: "Humidity",
    ph: "pH",
    rainfall: "Rainfall",
    uploading: "Uploading...",
    upload: "Upload",
    refresh: "Refresh",
    loading: "Loading...",

    back: "Back",
    forward: "Forward",
    
    cropProductivity: "Crop Productivity",
    sustainableFarming: "Sustainable Farming",
    organicFarming: "Organic Farming",
    cropDiseases: "Crop Diseases",
    waterManagement: "Water Management",
    soilHealth: "Soil Health",
    climateAdaptations: "Climate Adaptations",
    modernTechniques: "Modern Techniques",
    marketTrends: "Market Trends",
    governmentPolicies: "Government Policies",
    farmEquipment: "Farm Equipment",
    pestManagement: "Pest Management",
    fertilizerOptimization: "Fertilizer Optimization",
    cropVarieties: "Crop Varieties",
    refreshInsights: "Refresh Insights",
    
    generalAgriculture: "General Agriculture",
    cropProduction: "Crop Production",
    agritech: "AgriTech",
    marketPrices: "Market Prices",
    climateUpdates: "Climate Updates",
    governmentSchemes: "Government Schemes",
    farmerStories: "Farmer Stories",
    agriculturalExports: "Agricultural Exports",
    ruralDevelopment: "Rural Development",
    farmMechanization: "Farm Mechanization",
    agricultureEducation: "Agriculture Education",
    livestockFarming: "Livestock Farming",
    irrigationNews: "Irrigation News",
    agriculturalResearch: "Agricultural Research",
    refreshNews: "Refresh News",
    
    dashboard: "Dashboard",
    chatbot: "Chat with Expert",
    navigation: "Navigation",
    language: "Language", 
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    poweredBy: "Powered By",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    aboutUs: "About Us",
    contactUs: "Contact Us",
  },
  hi: {
    chatWithUs: "कृषि विशेषज्ञ से चैट करें",
    chatWithUsDesc: "हमारे AI सहायक से अपने सभी कृषि प्रश्नों के त्वरित उत्तर प्राप्त करें",
    cropPrediction: "फसल भविष्यवाणी",
    cropPredictionDesc: "मिट्टी और मौसम के आधार पर कौन सी फसल उगानी है, यह जानें",
    pesticideGuide: "कीटनाशक गाइड",
    pesticideGuideDesc: "अपनी विशिष्ट आवश्यकताओं के लिए सही कीटनाशक खोजें",
    fertilizerGuide: "उर्वरक गाइड",
    fertilizerGuideDesc: "अपनी फसलों के लिए आदर्श उर्वरक जानें",
    soilRequirements: "मिट्टी की आवश्यकताएँ",
    soilRequirementsDesc: "विभिन्न फसलों के लिए मिट्टी की आवश्यकताओं के बारे में जानें",
    cropRotation: "फसल चक्र",
    cropRotationDesc: "उचित फसल चक्र के साथ अपनी भूमि का उपयोग अनुकूलित करें",
    insights: "अंतर्दृष्टि",
    prediction: "भविष्यवाणी",
    news: "समाचार",
    helplineTitle: "किसान हेल्पलाइन",
    tollFree: "टोल फ्री: 1800-180-1551",
    phone: "फोन: +91 11-25846391 से 95",
    whatsapp: "व्हाट्सएप",
    whatsappText: "9599780225",
    companyInfoTitle: "हमारे बारे में",
    companyDescription1: "हम किसानों को प्रौद्योगिकी के साथ सशक्त बनाने के लिए समर्पित हैं।",
    companyDescription2: "हमारे AI उपकरण बेहतर कृषि निर्णय लेने में मदद करते हैं।",
    companyDescription3: "2023 से भारतीय किसानों की सेवा कर रहे हैं।",
    
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    error: "त्रुटि",
    errorFetchingData: "डेटा प्राप्त करने में त्रुटि",
    cropPredictionManagement: "फसल भविष्यवाणी प्रबंधन",
    cropName: "फसल का नाम",
    nitrogen: "नाइट्रोजन",
    phosphorus: "फॉस्परस",
    potassium: "पोटेशियम",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    ph: "पीएच",
    rainfall: "वर्षा",
    uploading: "अपलोड हो रहा है...",
    upload: "अपलोड करें",
    refresh: "रीफ्रेश करें",
    loading: "लोड हो रहा है...",

    back: "पीछे",
    forward: "आगे",
    
    cropProductivity: "फसल उत्पादकता",
    sustainableFarming: "सतत खेती",
    organicFarming: "जैविक खेती",
    cropDiseases: "फसल रोग",
    waterManagement: "जल प्रबंधन",
    soilHealth: "मिट्टी का स्वास्थ्य",
    climateAdaptations: "जलवायु अनुकूलन",
    modernTechniques: "आधुनिक तकनीकें",
    marketTrends: "बाजार का रुझान",
    governmentPolicies: "सरकारी नीतियां",
    farmEquipment: "कृषि उपकरण",
    pestManagement: "कीट प्रबंधन",
    fertilizerOptimization: "उर्वरक अनुकूलन",
    cropVarieties: "फसल किस्में",
    refreshInsights: "अंतर्दृष्टि रीफ्रेश करें",
    
    generalAgriculture: "सामान्य कृषि",
    cropProduction: "फसल उत्पादन",
    agritech: "कृषि तकनीक",
    marketPrices: "बाजार मूल्य",
    climateUpdates: "जलवायु अपडेट",
    governmentSchemes: "सरकारी योजनाएँ",
    farmerStories: "किसानों की कहानियाँ",
    agriculturalExports: "कृषि निर्यात",
    ruralDevelopment: "ग्रामीण विकास",
    farmMechanization: "कृषि यांत्रिकीकरण",
    agricultureEducation: "कृषि शिक्षा",
    livestockFarming: "पशुपालन",
    irrigationNews: "सिंचाई समाचार",
    agriculturalResearch: "कृषि अनुसंधान",
    refreshNews: "समाचार रीफ्रेश करें",
    
    dashboard: "डैशबोर्ड",
    chatbot: "विशेषज्ञ से चैट करें",
    navigation: "नेविगेशन",
    language: "भाषा", 
    appearance: "दिखावट",
    light: "प्रकाश",
    dark: "अंधेरा",
    poweredBy: "Powered By",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    aboutUs: "About Us",
    contactUs: "Contact Us",
  },
  te: {
    chatWithUs: "వ్యవసాయ నిపుణుడితో చాట్ చేయండి",
    chatWithUsDesc: "మా AI సహాయకుడి నుండి మీ అన్ని వ్యవసాయ ప్రశ్నలకు త್వరిత సమాధానాలను పొందండ",
    cropPrediction: "పంట అంచనా",
    cropPredictionDesc: "నేల మరియు వాతావరణం ఆధారంగా ఏ పంట పండించాలో అంచనా వేయండి",
    pesticideGuide: "పురుగుమందుల గైడ్",
    pesticideGuideDesc: "మీ నిర్దిష్ట అవసరాలకు సరైన పురుగుమందును కనుగొనండి",
    fertilizerGuide: "ఎరువుల గైడ్",
    fertilizerGuideDesc: "మీ పంటలకు ఆదర్శ ఎరువును కనుగొనండి",
    soilRequirements: "నేల అవసరాలు",
    soilRequirementsDesc: "వివిధ పంటలకు నేల అవసరాల గురించి తెలుసుకోండి",
    cropRotation: "పంట మార్పిడి",
    cropRotationDesc: "సరైన పంట మార్పిడితో మీ భూమి వినియోగాన్ని ఆప్టిమైజ్ చేయండి",
    insights: "అంతర్దృష్టులు",
    prediction: "అంచనా",
    news: "వార్తలు",
    helplineTitle: "రైతు హెల్ప్‌లైన్",
    tollFree: "టోల్ ఫ్రీ: 1800-180-1551",
    phone: "ఫోన్: +91 11-25846391 నుండి 95",
    whatsapp: "వాట్సాప్",
    whatsappText: "9599780225",
    companyInfoTitle: "మా గురించి",
    companyDescription1: "మేము రైతులను సాంకేతికతతో శక్తివంతం చేశాము.",
    companyDescription2: "మా AI సాధనాలు మెరుగైన వ్యవసాయ నిర్ణయాలు తೆగೆదುకೊళ್ళలు సహాయపడతాయి.",
    companyDescription3: "2023 నుండి భారతీయ రైతులకు సేవలందిస్తುన్నాము.",
    
    backToDashboard: "డాష్‌బోర్డ్‌కి తిరిగి వెళ్ళండి",
    error: "లోపం",
    errorFetchingData: "డేటాను పొందడంలో లోపం",
    cropPredictionManagement: "పంట అంచనా నిర్వహణ",
    cropName: "పంట పేరు",
    nitrogen: "నత్రజని",
    phosphorus: "ఫాస్పరస్",
    potassium: "పೊట್యాశియ್",
    temperature: "ఉష్ణోగ్రత",
    humidity: "తేమశాతం",
    ph: "పిహెచ్",
    rainfall: "వర్షపాతం",
    uploading: "అప్‌లోడ్ అవుతోంది...",
    upload: "అప్‌లోడ్ చేయండి",
    refresh: "రీఫ్రెశ్ చేయండి",
    loading: "లోడ్ అవుతోంది...",

    back: "వెనుకకు",
    forward: "ముందుకు",
    
    cropProductivity: "పంట ఉత్పాదకత",
    sustainableFarming: "స్థిరమైన వ్యవసాయం",
    organicFarming: "సావయవ కృషి",
    cropDiseases: "పంట వ్యాధులు",
    waterManagement: "నీటి నిర్వహణ",
    soilHealth: "నేల ఆరోగ్యం",
    climateAdaptations: "వాతావరణ సర్దుబాట్లు",
    modernTechniques: "ఆధునిక తంత్రగళు",
    marketTrends: "మార్కెట్ ధోరణులు",
    governmentPolicies: "ప్రభుత్వ విధానాలు",
    farmEquipment: "వ్యవసాయ పరికరాలు",
    pestManagement: "పురుగుమందు నిర్వహణ",
    fertilizerOptimization: "ఎరువుల ఆప్టిమైసేశన్",
    cropVarieties: "పంట రకాలు",
    refreshInsights: "అంతర్దృష్టులను రిఫ్రెశ్ చేయండి",
    
    generalAgriculture: "సాధారణ వ్యవసాయం",
    cropProduction: "పంట ఉత్పాదనె",
    agritech: "వ్యవసాయ సాంకేతికత",
    marketPrices: "మారుకట్టె బెలెగళు",
    climateUpdates: "వాతావరణ నవీకరణలు",
    governmentSchemes: "ప్రభుత్వ పథకాలు",
    farmerStories: "రైతుల కథలు",
    agriculturalExports: "వ్యవసాయ ఎగుమతులు",
    ruralDevelopment: "గ్రామీణ అభివృద్ధి",
    farmMechanization: "వ్యవసాయ యాంత్రీకరణ",
    agricultureEducation: "వ్యవసాయ విద్య",
    livestockFarming: "పశుసంపద సాగు",
    irrigationNews: "నీటిపారుదల వార్తలు",
    agriculturalResearch: "వ్యవసాయ పరిశోధన",
    refreshNews: "వార్తలను రిఫ్రెశ్ చేయండి",
    
    dashboard: "డాష్‌బోర్డ్",
    chatbot: "నిపుణుడితో చాట్",
    navigation: "నావిగేషన్",
    language: "భాష", 
    appearance: "రూపం",
    light: "లైట్",
    dark: "డార్క్",
    poweredBy: "Powered By",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    aboutUs: "About Us",
    contactUs: "Contact Us",
  },
  kn: {
    chatWithUs: "ಕೃಷಿ ತಜ್ಞರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ",
    chatWithUsDesc: "ನಮ್ಮ AI ಸಹಾಯಕದಿಂದ ನಿಮ್ಮ ಎಲ್ಲ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ತ್ವರಿತ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ",
    cropPrediction: "ಬೆಳೆ ಭವಿಷ್ಯವಾಣಿ",
    cropPredictionDesc: "ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನದ ಆಧಾರದ ಮೇಲೆ ಯಾವ ಬೆಳೆ ಬೆಳೆಯಾಣೆನ್ನು ಊಹಿಸಿ",
    pesticideGuide: "ಕೀಟನಾಶಿನಿ ಗೈಡ್",
    pesticideGuideDesc: "ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಅಗತ್ಯಗಳಿಗೆ ಶರಿಯಾದ ಕೀಟನಾಶಿನಿ ಕಂಡುಕೊಳ್ಳಿ",
    fertilizerGuide: "ರಸಗೊಬ್ಬರ ಗೈಡ್",
    fertilizerGuideDesc: "ನಿಮ್ಮ ಬೆಳೆಗಳಿಗೆ ಆದರ್ಶಮಾಯ ರಸಗೊಬ್ಬರ ಕಂಡುಕೊಳ್ಳಿ",
    soilRequirements: "ಮಣ್ಣು ಆವಶ್ಯಕತೆಗಳು",
    soilRequirementsDesc: "ವಿವಿಧ ಬೆಳೆಗಳಿಗೆ ಮಣ್ಣಿನ ಆವಶ್ಯಕತೆಗಳ ಬಗ್ಗೆ ತಿಳಿದುಕೊಳ್ಳಿ",
    cropRotation: "ಬೆಳೆ ತಿರುಗುವಿಕೆ",
    cropRotationDesc: "ಶರಿಯಾದ ಬೆಳೆ ತಿರುಗುವಿಕೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಭೂಮಿಯ ಬಳಕೆಯನ್ನು ಆಪ್ಟಿಮೈಸ್ ಮಾಡಿ",
    insights: "ಒಳನೋಟಗಳು",
    prediction: "ಭವಿಷ್ಯವಾಣಿ",
    news: "ಸುದ್uddಿ",
    helplineTitle: "ರೈತ ಹೆಲ್ಪ್‌ಲೈನ್",
    tollFree: "ಟೋಲ್ ಫ್ರೀ: 1800-180-1551",
    phone: "ಫೋನ್: +91 11-25846391 ರಿಂದ 95",
    whatsapp: "ವಾಟ್ಸಾಪ್",
    whatsappText: "9599780225",
    companyInfoTitle: "ನಮ್ಮ ಬಗ್ಗೆ",
    companyDescription1: "ನಾವು ರೈತರನ್ನು ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ಸಬಲೀಕರಣಗೊಳಿಸಲು ಸಮർಪಿತವಾಗಿದ್ದೇವೆ.",
    companyDescription2: "ನಮ್ಮ AI ಉಪಕರಣಗಳು ಉತ್ತಮ ಕೃಷಿ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ಸಹಾಯಿಕ್ಕುತ್ತವೆ.",
    companyDescription3: "2023 ನುಂಡಿ ಭಾರತೀಯ ರೈತರಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಿದ್ದೇವೆ.",
    
    backToDashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    error: "ದೋಷ",
    errorFetchingData: "ಡೇಟಾವನ್ನು ಪಡೆಯುವಲ್ಲಿ ದೋಷ",
    cropPredictionManagement: "ಬೆಳೆ ಭವಿಷ್ಯವಾಣಿ ನಿರ್ವಹಣೆ",
    cropName: "ಬೆಳೆ ಹೆಸರು",
    nitrogen: "ನೈಟ್ರಜನ್",
    phosphorus: "ಫಾಸ್ಫರಸ್",
    potassium: "ಪೊಟ್ಯಾಶಿಯ್",
    temperature: "ತಾಪಮಾನ",
    humidity: "ಆರ್ದ್ರತೆ",
    ph: "ಪಿಹೆಚ್",
    rainfall: "ಮಳೆ",
    uploading: "ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    upload: "ಅಪ್‌ಲೋಡ್",
    refresh: "ರಿಫ್ರೆಶ್",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",

    back: "ಹಿಂದೆ",
    forward: "ಮುಂದೆ",
    
    cropProductivity: "ಬೆಳೆ ಉತ್ಪಾದಕತೆ",
    sustainableFarming: "ಸುಸ್ಥಿರ ಕೃಷಿ",
    organicFarming: "ಸಾವಯವ ಕೃಷಿ",
    cropDiseases: "ಬೆಳೆ ರೋಗಗಳು",
    waterManagement: "ನೀರಿನ ನಿರ್ವಹಣೆ",
    soilHealth: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ",
    climateAdaptations: "ಹವಾಮಾನ ಹೊಂದಾಣಿಕೆಗಳು",
    modernTechniques: "ಆಧುನಿಕ ತಂತ್ರಗಳು",
    marketTrends: "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳು",
    governmentPolicies: "ಸರ್ಕಾರದ ನೀತಿಗಳು",
    farmEquipment: "ಕೃಷಿ ಉಪಕರಣಗಳು",
    pestManagement: "ಕೀಟ ನಿರ್ವಹಣೆ",
    fertilizerOptimization: "ರಸಗೊಬ್ಬರ ಆಪ್ಟಿಮೈಸೇಶನ್",
    cropVarieties: "ಬೆಳೆ ತಳಿಗಳು",
    refreshInsights: "ಒಳನೋಟಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    
    generalAgriculture: "ಸಾಮಾನ್ಯ ಕೃಷಿ",
    cropProduction: "ಬೆಳೆ ಉತ್ಪಾದನೆ",
    agritech: "ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ",
    marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    climateUpdates: "ಹವಾಮಾನ ನವೀಕರಣಗಳು",
    governmentSchemes: "ಸರ್ಕಾರದ ಯೋಜನೆಗಳು",
    farmerStories: "ರೈತುಳೆ ಕಥೆಗಳು",
    agriculturalExports: "ಕೃಷಿ ರಫ್ತುಗಳು",
    ruralDevelopment: "ಗ್ರಾಮೀಣ ಅಭಿವೃದ್ಧಿ",
    farmMechanization: "ಕೃಷಿ ಯಾಂತ್ರೀಕರಣ",
    agricultureEducation: "ಕೃಷಿ ಶಿಕ್ಷಣ",
    livestockFarming: "ಪಶುಸಂಗೋಪನೆ",
    irrigationNews: "ನೀರಾವರಿ ಸುದ್uddಿಗಳು",
    agriculturalResearch: "ಕೃಷಿ ಸಂಶೋಧನೆ",
    refreshNews: "ಸುದ್uddಿಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    
    dashboard: "ಡ್ಯಾಶ್ಬೋರ್ಡ್",
    chatbot: "ನಿಪುಣುಡಿತೋ ಚಾಟ್",
    navigation: "ನ್ಯಾವಿಗೇಶನ್",
    language: "ಭಾಷೆ", 
    appearance: "ರೂಪ",
    light: "ಬೆಳಕು",
    dark: "ಕತ್ತಲೆ",
    poweredBy: "Powered By",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    aboutUs: "About Us",
    contactUs: "Contact Us",
  },
  ml: {
    chatWithUs: "കൃഷി വിദഗ്ദ്ധനുമായി ചാറ്റ് ചെയ്യുക",
    chatWithUsDesc: "ഞങ്ങളുടെ AI സഹായിയിൽ നിന്ന് നിങ്ങളുടെ എല്ലാ കാർഷിക ചോദ്യങ്ങൾക്കും വേഗത്തിലുള്ള ഉത്തരങ്ങൾ നേടുക",
    cropPrediction: "വിള പ്രവചനം",
    cropPredictionDesc: "മണ്ണ് മുതൽ കാലാവസ്ഥയുടെയും അടിസ്ഥാനത്തിൽ ഏത് വിളയാണ് വളർത്തേണ്ടതെന്ന് പ്രവചിക്കുക",
    pesticideGuide: "കീടനാശിനി ഗൈഡ്",
    pesticideGuideDesc: "നിങ്ങളുടെ പ്രത്യേക ആവശ്യങ്ങൾക്ക് ശരിയായ കീടനാശിനി കംടെത്തുക",
    fertilizerGuide: "വള ഗൈഡ്",
    fertilizerGuideDesc: "നിങ്ങളുടെ വിളകൾക്ക് ആദർശമായ വളം കംടെത്തുക",
    soilRequirements: "മണ്ണ് ആവശ്യകതകൾ",
    soilRequirementsDesc: "വ്യത്യസ്ത വിളകൾക്കുള്ള മണ്ണിന്റെ ആവശ്യകതകളെക്കുറിച്ച് മനസ്സിലാക്കുക",
    cropRotation: "വിള കറക്കം",
    cropRotationDesc: "ശരിയായ വിള കറക്കം ഉപയോഗിച്ച് നിങ്ങളുടെ ഭൂമിയുടെ ഉപയോഗം ഒപ്റ്റിമൈസ് ചെയ്യുക",
    insights: "ഉൾക്കാഴ്ചകൾ",
    prediction: "പ്രവചനം",
    news: "വാർത്ത",
    helplineTitle: "കർഷക ഹെൽപ്‌ലൈൻ",
    tollFree: "ടോൾ ഫ്രീ: 1800-180-1551",
    phone: "ഫോൺ: +91 11-25846391 മുതൽ 95 വരെ",
    whatsapp: "വാട്ട്സ്ആപ്പ്",
    whatsappText: "9599780225",
    companyInfoTitle: "ഞങ്ങളെക്കുറിച്ച്",
    companyDescription1: "ഞങ്ങൾ കർഷകരെ സാങ്കേതികവിദ്യയിലൂടെ ശാക്തീകരിക്കാൻ സമർപ്പിക്കിരിക്കുന്നു.",
    companyDescription2: "ഞങ്ങളുടെ AI ഉപകരണങ്ങൾ മികച്ച കാർഷിക തീരുമാനങ്ങൾ എടുക്കാൻ സഹായിക്കുന്നു.",
    companyDescription3: "2023 മുതൽ ഇന്ത്യൻ കർഷകരെ സേവിക്കുന്നു.",
    
    backToDashboard: "ഡാഷ്ബോർഡിലേക്ക് മടങ്ങുക",
    error: "പിശക്",
    errorFetchingData: "ഡാറ്റ ലഭിക്കുന്നതിൽ പിശക്",
    cropPredictionManagement: "വിള പ്രവചന മാനേജ്മെന്റ്",
    cropName: "വിളയുടെ പേര്",
    nitrogen: "നൈട്രജൻ",
    phosphorus: "ഫോസ്ഫറസ്",
    potassium: "പൊട്ടാസ്യം",
    temperature: "താപനില",
    humidity: "ആർദ്രത",
    ph: "പിഎച്ച്",
    rainfall: "മഴ",
    uploading: "അപ്‌ലോഡ് ചെയ്യുന്നു...",
    upload: "അപ്‌ലോഡ്",
    refresh: "പുതുക്കുക",
    loading: "ലോഡ് ചെയ്യുന്നു...",

    back: "പിന്നോട്ട്",
    forward: "മുന്നോട്ട്",
    
    cropProductivity: "വിള ഉൽപാദനക്ഷമത",
    sustainableFarming: "സുസ്ഥിര കൃഷി",
    organicFarming: "ജൈവ കൃഷി",
    cropDiseases: "വിള രോഗങ്ങൾ",
    waterManagement: "ജല മാനേജ്മെന്റ്",
    soilHealth: "മണ്ണിന്റെ ആരോഗ്യം",
    climateAdaptations: "കാലാവസ്ഥ അനുരൂപപ്പെടലുകൾ",
    modernTechniques: "ആധുനിക സാങ്കേതികിദ്യകൾ",
    marketTrends: "വിപണി പ്രവണതകൾ",
    governmentPolicies: "സർക്കാർ നയങ്ങൾ",
    farmEquipment: "കാർഷിക ഉപകരണങ്ങൾ",
    pestManagement: "കീട മാനേജ്മെന്റ്",
    fertilizerOptimization: "വള ഒപ്റ്റിമൈസേഷൻ",
    cropVarieties: "വിള ഇനങ്ങൾ",
    refreshInsights: "ഉൾക്കാഴ്ചകൾ പുതുക്കുക",
    
    generalAgriculture: "പൊതു കൃഷി",
    cropProduction: "വിള ഉത്പാദനം",
    agritech: "കാർഷിക സാങ്കേതികവിദ്യ",
    marketPrices: "വിപണി വിലകൾ",
    climateUpdates: "കാലാവസ്ഥ അപ്ഡേറ്റുകൾ",
    governmentSchemes: "സർക്കാർ പദ്ധതികൾ",
    farmerStories: "കർഷകരുടെ കഥകൾ",
    agriculturalExports: "കാർഷിക കയറ്റുമതികൾ",
    ruralDevelopment: "ഗ്രാമ വികസനം",
    farmMechanization: "കൃഷി യന്ത്രവൽക്കരണം",
    agricultureEducation: "കാർഷിക വിദ്യാഭ്യാസം",
    livestockFarming: "കന്നുകാലി വളർത്തൽ",
    irrigationNews: "ജലസേചന വാർത്തകൾ",
    agriculturalResearch: "കാർഷിക ഗവേഷണം",
    refreshNews: "വാർത്തകൾ പുതുക്കുക",
    
    dashboard: "ഡാഷ്ബോർഡ്",
    chatbot: "വിദഗ്ദ്ധനുമായി ചാറ്റ് ചെയ്യുക",
    navigation: "നാവിഗേഷൻ",
    language: "ഭാഷ", 
    appearance: "രൂപം",
    light: "വെളിച്ചം",
    dark: "ഇരുട്ട്",
    poweredBy: "Powered By",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    aboutUs: "About Us",
    contactUs: "Contact Us",
  },
};

const cropNameTranslations: Record<Language, Record<string, string>> = {
  en: {
    "rice": "Rice",
    "maize": "Maize",
    "chickpea": "Chickpea",
    "kidneybeans": "Kidney Beans",
    "pigeonpeas": "Pigeon Peas",
    "mothbeans": "Moth Beans",
    "mungbean": "Mung Bean",
    "blackgram": "Black Gram",
    "lentil": "Lentil",
    "pomegranate": "Pomegranate",
    "banana": "Banana",
    "mango": "Mango",
    "grapes": "Grapes",
    "watermelon": "Watermelon",
    "muskmelon": "Muskmelon",
    "apple": "Apple",
    "orange": "Orange",
    "papaya": "Papaya",
    "coconut": "Coconut",
    "cotton": "Cotton",
    "jute": "Jute",
    "coffee": "Coffee",
    "wheat": "Wheat",
  },
  hi: {
    "rice": "चावल",
    "maize": "मक्का",
    "chickpea": "चना",
    "kidneybeans": "राजमा",
    "pigeonpeas": "अरहर",
    "mothbeans": "मोठ",
    "mungbean": "मूंग",
    "blackgram": "उड़द",
    "lentil": "मसूर",
    "pomegranate": "अनार",
    "banana": "केला",
    "mango": "आम",
    "grapes": "अंगूर",
    "watermelon": "तरबूज",
    "muskmelon": "खरबूजा",
    "apple": "सेब",
    "orange": "संतरा",
    "papaya": "पपीता",
    "coconut": "नारियल",
    "cotton": "कपास",
    "jute": "जूट",
    "coffee": "कॉफी",
    "wheat": "गेहूं",
  },
  te: {
    "rice": "వరి",
    "maize": "మొక్కజొన్న",
    "chickpea": "శనగలు",
    "kidneybeans": "రాజ్మా",
    "pigeonpeas": "కందిపప్పు",
    "mothbeans": "మినుములు",
    "mungbean": "పెసరపప్పు",
    "blackgram": "మినపప్పు",
    "lentil": "మసూర్ దాల్",
    "pomegranate": "దానిమ్మ",
    "banana": "అరటి",
    "mango": "మామిడి",
    "grapes": "ద్రాక్ష",
    "watermelon": "పుచ్చకాయ",
    "muskmelon": "ఖర్బూజా",
    "apple": "యాపిల్",
    "orange": "నారింజ",
    "papaya": "బొప్పాయి",
    "coconut": "కొబ్బరి",
    "cotton": "పత్తి",
    "jute": "జనపనార",
    "coffee": "కాఫీ",
    "wheat": "గోధుమ",
  },
  kn: {
    "rice": "ಅಕ್ಕಿ",
    "maize": "ಮೆಕ್ಕೆಜೋಳ",
    "chickpea": "ಕಡಲೆ",
    "kidneybeans": "ರಾಜ್ಮಾ",
    "pigeonpeas": "ತೊಗರಿ",
    "mothbeans": "ಮೊತ್ ಬೀನ್ಸ್",
    "mungbean": "ಹೆಸರು",
    "blackgram": "ಉuddು",
    "lentil": "ಮಸೂರ",
    "pomegranate": "ದಾಳಿಂಬೆ",
    "banana": "ಬಾಳೆಹಣ್ಣು",
    "mango": "ಮಾವು",
    "grapes": "ದ್ರಾಕ್ಷಿ",
    "watermelon": "ಕಲ್ಲಂಗಡಿ",
    "muskmelon": "ಕರ್ಬೂಜ",
    "apple": "ಸೇಬು",
    "orange": "ಕಿತ್ತಳೆ",
    "papaya": "ಪಪ್ಪಾಯ",
    "coconut": "ತೆಂಗಿನಕಾಯಿ",
    "cotton": "ಹತ್ತಿ",
    "jute": "ಚಣ",
    "coffee": "ಕಾಫಿ",
    "wheat": "ಗೋಧಿ",
  },
  ml: {
    "rice": "അരി",
    "maize": "ചോളം",
    "chickpea": "കടല",
    "kidneybeans": "രാജ്മ",
    "pigeonpeas": "തുവര",
    "mothbeans": "മോത്ത് ബീൻസ്",
    "mungbean": "ചെറുപയർ",
    "blackgram": "ഉഴുന്ന്",
    "lentil": "പരിപ്പ്",
    "pomegranate": "മാതളനാരകം",
    "banana": "വാഴപ്പഴം",
    "mango": "മാമ്പഴം",
    "grapes": "മുന്തിരിങ്ങ",
    "watermelon": "കല്ലಂഗഡി",
    "muskmelon": "മുട്ടക്കൂസ്",
    "apple": "ആപ്പിൾ",
    "orange": "ഓറഞ്ച്",
    "papaya": "പപ്പായ",
    "coconut": "തേങ്ങ",
    "cotton": "പരുത്തി",
    "jute": "ചണം",
    "coffee": "കാപ്പി",
    "wheat": "ഗോതമ്പ്",
  }
};

export interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  changeLanguage: (language: Language) => void;
  t: (key: keyof TranslationDictionary) => string;
  getCropNameTranslation: (cropName: string) => string;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: keyof TranslationDictionary) => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };
  
  const getCropNameTranslation = (cropName: string) => {
    const normalizedCropName = cropName.toLowerCase();
    return cropNameTranslations[language][normalizedCropName] || 
           cropNameTranslations.en[normalizedCropName] || 
           cropName;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, t, getCropNameTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
