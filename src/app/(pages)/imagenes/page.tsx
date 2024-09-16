"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { serviceGetAllNews } from "@/services/news.service";
import { serviceGetAllServices } from "@/services/services.service";
import LoadingSpinner from "@/shared/LoadingSpinner/LoadingSpinner";
import React, { useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const {toast } = useToast()

  useEffect(() => {
    const usersFetch: any = async () => {
      setLoading(true);
      const imagenesState = [...imagenes];
      try {
        const responseUsers = await serviceGetAllServices();
        responseUsers.forEach((item) => {
          imagenesState.push(item.imagen);
          setImagenes(imagenesState);
        });
      } catch (e) {
        console.error("Ha ocurrido un error en la petición");
        toast({
          description: "No se han podido obtener los servicios."
        })
      }
      try {
        const responseNews = await serviceGetAllNews();
        responseNews.forEach((item) => {
          imagenesState.push(item.imagen);
          setImagenes(imagenesState);
        });
      } catch (e) {
        console.error("Ha ocurrido un error en la petición");
        toast({
          description: "No se han podido obtener las noticias."
        })
      } finally {
        setLoading(false);
      }
    };
    usersFetch();
    //eslint-disable-next-line
  }, []);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`w-full flex justify-center flex-col items-center max-w-full bg-[url('/background-image.png')] bg-bottom bg-no-repeat mb-10 ${
        loading ? "bg-cover" : "bg-contain"
      }`}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full justify-center px-10 flex flex-wrap">
          {imagenes.length > 0 &&
            imagenes.map((item: string, index: number) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  {/* eslint-disable-next-line */}
                  <img
                    src={item}
                    className={`w-full md:w-1/2 ${
                      (index - 1) % 3 === 0 ? "lg:w-1/3" : "lg:w-1/4"
                    } p-3 h-72 rounded-xl cursor-pointer`}
                    onClick={() => handleImageClick(index)}
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] p-0 m-0 border-0">
                  {/* eslint-disable-next-line */}
                  <img
                    src={item}
                    className={`${
                      (index - 1) % 3 === 0 ? "w-full" : "w-full"
                    } h-72 rounded-md cursor-pointer`}
                    onClick={() => handleImageClick(index)}
                  />
                </DialogContent>
              </Dialog>
            ))}
        </div>
      )}
    </div>
  );
};

export default Page;
