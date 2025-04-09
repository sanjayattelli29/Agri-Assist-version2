
import { ReactNode } from "react";
import { LanguageProvider as Provider, useLanguage } from "@/contexts/LanguageContext";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  return <Provider>{children}</Provider>;
};

export { useLanguage };
export default LanguageProvider;
