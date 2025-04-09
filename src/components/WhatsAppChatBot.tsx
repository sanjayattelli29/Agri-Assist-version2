
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MessageCircle, 
  Send, 
  Check, 
  CheckCheck, 
  Phone,
  Image,
  UserRound,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistance } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  text: string;
  summary?: string;
  isUser: boolean;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  matchedKeywords?: string[];
  source?: string | null;
  showFullDetails?: boolean;
}

const translations = {
  title: {
    en: "Agri Assist",
    hi: "कृषि सहायक",
    te: "వ్యవసాయ సహాయకుడు",
    kn: "ಕೃಷಿ ಸಹಾಯಕ",
    ml: "കാർഷിക സഹായി",
  },
  placeholder: {
    en: "Type your message...",
    hi: "अपना संदेश लिखें...",
    te: "మీ సందేశాన్ని టైప్ చేయండి...",
    kn: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
    ml: "നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...",
  },
  welcomeMessage: {
    en: "Hello! Welcome to Agri Assist. How can I help you with agriculture today?",
    hi: "नमस्ते! कृषि सहायक में आपका स्वागत है। आज कृषि के बारे में मैं आपकी कैसे मदद कर सकता हूँ?",
    te: "హలో! వ్యవసాయ సహాయకుడికి స్వాగతం. నేడు వ్యవసాయంలో నేను మీకు ఎలా సహాయం చేయగలను?",
    kn: "ನಮಸ್ಕಾರ! ಕೃಷಿ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ಇಂದು ಕೃಷಿಯ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    ml: "ഹലോ! കാർഷിക സഹായിയിലേക്ക് സ്വാഗതം. ഇന്ന് കൃഷിയെക്കുറിച്ച് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാൻ കഴിയും?",
  },
  typingIndicator: {
    en: "typing...",
    hi: "टाइप कर रहा है...",
    te: "టైప్ చేస్తోంది...",
    kn: "ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
    ml: "ടൈപ്പ് ചെയ്യുന്നു...",
  },
  source: {
    en: "Source:",
    hi: "स्रोत:",
    te: "మూలం:",
    kn: "ಮೂಲ:",
    ml: "ഉറവിടം:",
  },
  matchedKeywords: {
    en: "Matched:",
    hi: "मिलान हुआ:",
    te: "సరిపోలింది:",
    kn: "ಹೊಂದಿಕೆಯಾಗಿದೆ:",
    ml: "പൊരുത്തപ്പെട്ടു:",
  },
  showMore: {
    en: "Show more details",
    hi: "अधिक विवरण दिखाएँ",
    te: "మరిన్ని వివరాలు చూపించు",
    kn: "ಹೆಚ್ಚಿನ ವಿವರಗಳನ್ನು ತೋರಿಸಿ",
    ml: "കൂടുതൽ വിവരങ്ങൾ കാണിക്കുക",
  },
  showLess: {
    en: "Show less",
    hi: "कम दिखाएँ",
    te: "తక్కువ చూపించు",
    kn: "ಕಡಿಮೆ ತೋರಿಸಿ",
    ml: "കുറവ് കാണിക്കുക",
  }
};

const WhatsAppChatBot = () => {
  const { language } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: "welcome",
            text: translations.welcomeMessage[language as keyof typeof translations.welcomeMessage] || translations.welcomeMessage.en,
            isUser: false,
            timestamp: new Date(),
            status: "read"
          },
        ]);
      }, 1000);
    }
  }, [language, messages.length]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 1000);
  }, []);

  const randomPhoneNumber = "+91 " + Math.floor(10000000000 * Math.random()).toString().substring(0, 10);

  const toggleMessageDetails = (id: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id ? { ...msg, showFullDetails: !msg.showFullDetails } : msg
      )
    );
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      text: input,
      isUser: true,
      timestamp: new Date(),
      status: "sent" as "sent" | "delivered" | "read"
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? {...msg, status: "delivered" as "delivered"} : msg
        )
      );
    }, 1000);
    
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? {...msg, status: "read" as "read"} : msg
        )
      );
    }, 2000);
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("chatbot", {
        body: { message: input, language },
      });
      
      if (error) throw error;
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            summary: data.summary,
            text: data.response,
            isUser: false,
            timestamp: new Date(),
            status: "read" as "read",
            matchedKeywords: data.matchedKeywords,
            source: data.source,
            showFullDetails: false
          },
        ]);
      }, 1500 + Math.random() * 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage = {
        en: "Sorry, I'm having trouble connecting right now. Please try again later.",
        hi: "क्षमा करें, मुझे अभी कनेक्ट करने में परेशानी हो रही है। कृपया बाद में पुन: प्रयास करें।",
        te: "క్షమించండి, నేను ప్రస్తుతం కనెక్ట్ చేయడంలో ఇబ్బంది పడుతున్నాను. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",
        kn: "ಕ್ಷಮಿಸಿ, ನಾನು ಈಗ ಸಂಪರ್ಕಿಸಲು ತೊಂದರೆ ಅನುಭವಿಸುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        ml: "ക്ഷമിക്കണം, ഞാൻ ഇപ്പോൾ കണക്റ്റ് ചെയ്യുന്നതിൽ ബുദ്ധിമുട്ടുന്നു. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക."
      };
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            text: errorMessage[language as keyof typeof errorMessage] || errorMessage.en,
            isUser: false,
            timestamp: new Date(),
            status: "read" as "read"
          },
        ]);
      }, 2000);
      
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRelativeTime = (timestamp: Date) => {
    return formatDistance(timestamp, new Date(), { addSuffix: true });
  };

  const MessageStatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return <Check className="h-3 w-3 text-gray-400" />;
    }
  };

  const renderMatchedKeywords = (keywords?: string[]) => {
    if (!keywords || keywords.length === 0) return null;
    
    return (
      <div className="mt-1 text-xs flex items-center">
        <Search className="h-3 w-3 mr-1 text-gray-500" />
        <span className="text-gray-500">
          {translations.matchedKeywords[language as keyof typeof translations.matchedKeywords] || translations.matchedKeywords.en} {keywords.join(", ")}
        </span>
      </div>
    );
  };
  
  const renderSource = (source?: string | null) => {
    if (!source) return null;
    
    // Format the URL to be more readable
    let displaySource = source;
    try {
      const url = new URL(source);
      displaySource = url.hostname;
    } catch (e) {
      // If not a valid URL, just use the source as is
    }
    
    return (
      <div className="mt-1 text-xs flex items-center">
        <ExternalLink className="h-3 w-3 mr-1 text-gray-500" />
        <span className="text-gray-500">
          {translations.source[language as keyof typeof translations.source] || translations.source.en}{' '}
          <a href={source} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {displaySource}
          </a>
        </span>
      </div>
    );
  };

  return (
    <div className="flex h-[75vh] md:h-[700px] w-full flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
      <div className="bg-green-600 dark:bg-green-700 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-800"></span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-semibold">
                {translations.title[language as keyof typeof translations.title] || translations.title.en}
              </h3>
              <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-gray-100">{randomPhoneNumber}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Phone className="h-5 w-5" />
          <UserRound className="h-5 w-5" />
        </div>
      </div>
      
      <div 
        className="flex-1 bg-repeat w-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23a3e635' fill-opacity='0.10'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        <ScrollArea className="p-3 w-full">
          <div className="space-y-3 p-2">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"} mb-4`}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 shadow ${
                      msg.isUser
                        ? "bg-green-500 text-white rounded-tr-none"
                        : "bg-white dark:bg-gray-800 rounded-tl-none"
                    }`}
                  >
                    {msg.isUser ? (
                      <p className="break-words text-sm whitespace-pre-line">{msg.text}</p>
                    ) : (
                      <>
                        {/* For bot messages, show summary first */}
                        <p className="break-words text-sm whitespace-pre-line">
                          {msg.summary || msg.text}
                        </p>
                        
                        {/* Show full details button if there's more content */}
                        {msg.text && msg.summary && msg.text !== msg.summary && (
                          <button 
                            onClick={() => toggleMessageDetails(msg.id)} 
                            className="mt-2 flex items-center text-xs text-blue-500 hover:text-blue-600"
                          >
                            {msg.showFullDetails ? (
                              <>
                                <ChevronUp size={14} className="mr-1" />
                                {translations.showLess[language as keyof typeof translations.showLess] || translations.showLess.en}
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} className="mr-1" />
                                {translations.showMore[language as keyof typeof translations.showMore] || translations.showMore.en}
                              </>
                            )}
                          </button>
                        )}
                        
                        {/* Show full details when expanded */}
                        {msg.showFullDetails && (
                          <div className="mt-3 pt-3 border-t dark:border-gray-700">
                            <p className="break-words text-sm whitespace-pre-line">
                              {msg.text}
                            </p>
                          </div>
                        )}
                        
                        {msg.source && renderSource(msg.source)}
                        {msg.matchedKeywords && renderMatchedKeywords(msg.matchedKeywords)}
                      </>
                    )}
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <span className="text-[10px] opacity-70">
                        {formatMessageTime(msg.timestamp)}
                      </span>
                      {msg.isUser && <MessageStatusIcon status={msg.status} />}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className="flex justify-start mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="max-w-[85%] bg-white dark:bg-gray-800 rounded-lg rounded-tl-none p-3 shadow">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {translations.typingIndicator[language as keyof typeof translations.typingIndicator] || translations.typingIndicator.en}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <form 
        onSubmit={handleSendMessage} 
        className="p-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2 items-center"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={translations.placeholder[language as keyof typeof translations.placeholder] || translations.placeholder.en}
          className="flex-1"
          disabled={isLoading}
        />
        <button 
          type="button" 
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          disabled={isLoading}
        >
          <Image className="h-5 w-5" />
        </button>
        <button 
          type="submit" 
          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
          disabled={isLoading || !input.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default WhatsAppChatBot;
