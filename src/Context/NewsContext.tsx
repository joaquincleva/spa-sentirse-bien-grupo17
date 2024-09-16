"use client";
import { News } from "@/interfaces/News.interface";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface NewsContextType {
  newsContext: News | null;
  setNewsContext: (noticia: News | null) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [newsContext, setNewsContext] = useState<News | null>(null);

  return (
    <NewsContext.Provider
      value={{
        newsContext,
        setNewsContext,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error(
      "useNews debe ser usando dentro de newsContextProvider"
    );
  }
  return context;
};
