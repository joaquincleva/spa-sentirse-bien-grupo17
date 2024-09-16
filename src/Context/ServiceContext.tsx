"use client";
import { Service } from "@/interfaces/Service.interface";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ServiceContextType {
  serviceContext: Service | null;
  setServiceContext: (servicio: Service | null) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [serviceContext, setServiceContext] = useState<Service | null>(null);

  return (
    <ServiceContext.Provider
      value={{
        serviceContext,
        setServiceContext,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error(
      "useService debe ser usando dentro de serviceContextProvider"
    );
  }
  return context;
};
