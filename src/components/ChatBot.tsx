
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bot, Send, X, MessageSquare, CornerDownLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const translations = {
  title: {
    en: "Agri Assistant",
    hi: "कृषि सहायक",
    te: "వ్యవసాయ సహాయకుడు",
    kn: "ಕೃಷಿ ಸಹಾಯಕ",
    ml: "കാർഷിക സഹായി",
  },
  placeholder: {
    en: "Ask me anything about farming...",
    hi: "कृषि के बारे में कुछ भी पूछें...",
    te: "వ్యవసాయం గురించి ఏదైనా అడగండి...",
    kn: "ಕೃಷಿ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ...",
    ml: "കൃഷിയെക്കുറിച്ച് എന്തെങ്കിലും ചോദിക്കൂ...",
  },
  send: {
    en: "Send",
    hi: "भेजें",
    te: "పంపు",
    kn: "ಕಳುಹಿಸು",
    ml: "അയയ്ക്കുക",
  },
  initialMessage: {
    en: "Hello! I'm your agricultural assistant. How can I help you today?",
    hi: "नमस्ते! मैं आपका कृषि सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
    te: "హలో! నేను మీ వ్యవసాయ సహాయకుడిని. నేడు నేను మీకు ఎలా సహాయం చేయగలను?",
    kn: "ಹಲೋ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    ml: "ഹലോ! ഞാൻ നിങ്ങളുടെ കാർഷിക സഹായിയാണ്. ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാൻ കഴിയും?",
  },
};

const ChatBot = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: translations.initialMessage[language as keyof typeof translations.initialMessage] || translations.initialMessage.en,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [language, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      id: `user-${Date.now()}`,
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("chatbot", {
        body: { message: input, language },
      });
      
      if (error) throw error;
      
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Fallback error message
      const errorMessage = {
        en: "Sorry, I'm having trouble processing your request right now.",
        hi: "क्षमा करें, मुझे अभी आपके अनुरोध को संसाधित करने में परेशानी हो रही है।",
        te: "క్షమించండి, నేను ప్రస్తుతం మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో ఇబ్బంది పడుతున్నాను.",
        kn: "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸಂಸ್ಕರಿಸಲು ನನಗೆ ಈಗ ತೊಂದರೆಯಾಗುತ್ತಿದೆ.",
        ml: "ക്ഷമിക്കണം, നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യുന്നതിൽ എനിക്ക് ഇപ്പോൾ ബുദ്ധിമുട്ടുണ്ട്.",
      };
      
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: errorMessage[language as keyof typeof errorMessage] || errorMessage.en,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <div
      className={`mb-3 flex ${
        message.isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.isUser
            ? "bg-green-600 text-white dark:bg-green-700"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
      </div>
    </div>
  );

  const ChatContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b p-3 text-center">
        <h3 className="text-lg font-semibold">
          {translations.title[language as keyof typeof translations.title] ||
            translations.title.en}
        </h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] space-y-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
        className="border-t p-3"
      >
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              translations.placeholder[
                language as keyof typeof translations.placeholder
              ] || translations.placeholder.en
            }
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <CornerDownLeft className="mr-1 inline-block h-3 w-3" />
          Press Enter to send
        </div>
      </form>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-600 shadow-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <MessageSquare className="h-6 w-6 text-white" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] p-0">
            <ChatContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-green-600 shadow-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Bot className="h-6 w-6 text-white" />
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[500px] max-w-[400px] rounded-t-xl p-0">
            <ChatContent />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ChatBot;
