"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/Context/AuthContext";
import { News } from "@/interfaces/News.interface";
import { serviceGetAllNews } from "@/services/news.service";
import LoadingSpinner from "@/shared/LoadingSpinner/LoadingSpinner";
import RotatingCard from "@/shared/RotatingCard/RotatingCard";
import { NewspaperIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CreateNewsForm from "./CreateNewsForm";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [news, setNews] = useState<News[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const router = useRouter();
  const { authUser } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    const usersFetch: any = async () => {
      setLoading(true);
      try {
        const responseNews = await serviceGetAllNews();
        setNews(responseNews);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición");
        toast({
          description: "No se han podido obtener las noticias.",
        });
      } finally {
        setLoading(false);
      }
    };
    usersFetch();
  }, [editMode]);

  return (
    <div
      className={`w-screen flex justify-center flex-col items-center bg-[url('/background-image.png')] bg-bottom bg-no-repeat bg-[length:2000px_500px]
      `}
    >
      {loading ? (
        <LoadingSpinner />
      ) : !editMode ? (
        <div className="w-full flex flex-col">
          <div className="w-full flex my-10 flex-col items-center justify-center">
            {(authUser?.rol === "admin" || authUser?.rol === "personal") && (
              <Button
                variant={"default"}
                onClick={() => {
                  setEditMode(true);
                }}
                className={`mr-24 bg-green-700 hover:bg-green-800 text-white flex self-end text-2xl p-3 items-center justify-center rounded-lg md:right-24 lg:right-12
                  }`}
              >
                Crear noticia
              </Button>
            )}
            <h2 className="px-4 md:px-0 text-center text-2xl font-semibold">
              Entérate de las últimas noticias de nuestro SPA
            </h2>
            <Input
              className="w-1/2 my-5"
              size={2}
              placeholder="Buscar noticia"
              onChange={(e) => {
                setFilterText(e.target.value);
              }}
            />
            <div className="flex gap-2 mt-2 mb-5">
              <hr className="border-[3px] border-gray-500 w-[75px]" />
              <hr className="border-[3px] border-gray-500 w-[5px]" />
            </div>
            <div className="w-full flex flex-wrap justify-center px-10">
              {news.length > 0 &&
              news.filter(
                (item) =>
                  item.titulo
                    .toLowerCase()
                    .includes(filterText.toLowerCase()) ||
                  item.contenido
                    .toLowerCase()
                    .includes(filterText.toLowerCase())
              ).length > 0 ? (
                news
                  .filter(
                    (item) =>
                      item.titulo
                        .toLowerCase()
                        .includes(filterText.toLowerCase()) ||
                      item.contenido
                        .toLowerCase()
                        .includes(filterText.toLowerCase())
                  )
                  .map((item: News, index: number) => (
                    <RotatingCard content="news" key={index} item={item} />
                  ))
              ) : (
                <div className="text-xl bg-white rounded border-2 border-gray-500 px-3 py-2">
                  No se han encontrado noticias según el texto buscado
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <CreateNewsForm setEditMode={setEditMode} />
      )}
    </div>
  );
};

export default Page;
