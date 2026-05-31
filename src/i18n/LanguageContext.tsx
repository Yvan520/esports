import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from './translations';
import { t as translate } from './translations';

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LangContext = createContext<LangContextType>({
  lang: 'zh',
  toggleLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'en' || saved === 'zh') setLang(saved);
  }, []);

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  const tr = (key: string, params?: Record<string, string>) => translate(lang, key, params);

  return (
    <LangContext.Provider value={{ lang, toggleLang, t: tr }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
