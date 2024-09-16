import Content from "@/shared/Content/Content";
import Footer from "@/shared/Footer/Footer";
import Navbar from "@/shared/Navbar/Navbar";
import React from "react";

const layout = ({ children }: any) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </div>
  );
};

export default layout;
