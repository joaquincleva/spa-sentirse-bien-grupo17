"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuthContext } from "@/Context/AuthContext";
import { useServiceContext } from "@/Context/ServiceContext";
import { useToast } from "@/hooks/use-toast";
import { News } from "@/interfaces/News.interface";
import { Service } from "@/interfaces/Service.interface";
import { ServiceCategories } from "@/interfaces/ServiceCategories.interface";
import { User } from "@/interfaces/User.interface";
import { serviceGetAllNews } from "@/services/news.service";
import { serviceGetAllServices } from "@/services/services.service";
import { serviceGetAllCategories } from "@/services/servicesCategories.service";
import {
  serviceGetAllUsers,
  serviceGetUserById,
} from "@/services/users.service";
import GoogleMap from "@/shared/GoogleMap/GoogleMap";
import LoadingSpinner from "@/shared/LoadingSpinner/LoadingSpinner";
import RotatingCard from "@/shared/RotatingCard/RotatingCard";
import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon, NewspaperIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";

export default function Home() {
  const { setServiceContext } = useServiceContext();
  const {setAuthUser} = useAuthContext()
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [services, setServices] = useState<Service[]>([]);
  const [categoriesServices, setCategoriesServices] = useState<
    ServiceCategories[]
  >([]);
  const [news, setNews] = useState<News[]>([]);
  const router = useRouter();

  

  useEffect(() => {
    const usersFetch: any = async () => {
      setLoading(true);
      try {
        const responseUsers = await serviceGetAllServices();
        setServices(responseUsers);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición.");
        toast({
          description: "No se han podido obtener los usuarios."
        })
      }
      try {
        const responseCategories = await serviceGetAllCategories();
        setCategoriesServices(responseCategories);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición.");
        toast({
          description: "No se han podido obtener las categorías de servivios."
        })
      }
      try {
        const responseNews = await serviceGetAllNews();
        setNews(responseNews);
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
  }, []);

  return (
    <div
      className={`w-full flex justify-center flex-col items-center max-w-full bg-[url('/background-image.png')] bg-bottom bg-no-repeat mb-10 ${
        loading ? "bg-cover" : "bg-contain"
      }`}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-full w-full flex flex-col">
          <Carousel
            className="w-full p-0 m-0 gap-0 overflow-hidden px-0 md:px-20"
            style={{ margin: "0 !important", padding: "0 !important" }}
          >
            <CarouselContent
              className="w-full p-0 m-0 gap-0 flex"
              style={{ margin: "0 !important", padding: "0 !important" }}
            >
              <CarouselItem
                className="w-full flex flex-col items-center justify-center text-black px-[5%] gap-[15px] text-center"
                style={{
                  background: `url("/background.jpg") no-repeat center center/cover`,
                }}
              >
                <h1 className="text-2xl md:text-5xl font-extrabold">Sentirse Bien Spa</h1>
                <p className="text-sm md:text-base font-bold">
                Buscamos atraer la atención de nuestros clientes a través de experiencias inspiradas en la seducción de los sentidos. 
                </p>
                <p className="text-sm md:text-base font-bold">
                Adaptamos las propuestas con el objetivo de que logre desconectarse de la rutina y disfrute un momento de bienestar, en total armonía con la naturaleza.
                </p>
                <Link
                  href="/auth/register"
                  className="cursor-pointer flex text-[15px] border-2 border-white font-bold text-white bg-[#262626] py-[10px] px-[20px]"
                >
                  SignUp <ChevronRightIcon className="w-6 h-6" />
                </Link>
              </CarouselItem>
              {services.map((item: Service, index: Key | null | undefined) => (
                <CarouselItem
                  key={index}
                  className="w-full h-96 bg-cover bg-center m-0 p-0 cursor-pointer text-black hover:text-white"
                  style={{
                    backgroundImage: `url(${item.imagen})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    margin: "0 !important",
                    padding: "0 !important",
                  }}
                  onClick={() => {
                    setServiceContext(item);
                    router.push(`/servicios/${item.id}`);
                  }}
                >
                  <div className="w-full m-0 p-0 h-full hover:bg-black hover:bg-opacity-30 flex items-center justify-center">
                    <span className="font-semibold text-xl md:text-4xl pt-48">
                      {item.nombre}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant={"ghost"}
              className="left-[20px] md:left-[100px] p-0 m-0 text-black"
            />
            <CarouselNext
              variant={"ghost"}
              className="right-[20px] md:right-[100px] p-0 m-0 text-black"
            />
          </Carousel>

          <div className="w-full flex my-10 flex-col items-center justify-center">
            <h6 className="flex text-3xl gap-2 text-[#ff4f9d] font-bold">
              <NewspaperIcon className="h-6 w-6 text-yellow-400" />
              Últimas noticias
            </h6>
            <div className="flex gap-2 mt-2 mb-5">
              <hr className="border-[3px] border-gray-500 w-[75px]" />
              <hr className="border-[3px] border-gray-500 w-[5px]" />
            </div>
            <div className="w-full flex flex-wrap justify-center px-10">
              {news.length > 0 &&
                news.map((item: News, index: number) => (
                  <RotatingCard content="news" key={index} item={item} />
                ))}
            </div>
          </div>

          <div className="w-full flex my-10 flex-col items-center justify-center">
            <h6 className="flex text-3xl text-[#ff4f9d] gap-2 font-semibold">
              <FaceSmileIcon className="h-6 w-6 text-yellow-400" />
              Nuestros Servicios
            </h6>
            <div className="flex gap-2 mt-2 mb-5">
              <hr className="border-[3px] border-gray-500 w-[5px]" />
              <hr className="border-[3px] border-gray-500 w-[75px]" />
            </div>
            {categoriesServices.length > 0 &&
              categoriesServices.map(
                (item: ServiceCategories, index: number) => (
                  <div key={index} className="w-full px-10">
                    <h2 className="text-lg text-[#f76daa] font-semibold text-center">
                      {item.nombre}
                    </h2>
                    <div className="w-full flex flex-wrap justify-center">
                      {services.filter(
                        (service: Service) =>
                          service.categoria_servicio_id === item.id
                      ).length > 0 &&
                        services
                          .filter(
                            (service: Service) =>
                              service.categoria_servicio_id === item.id
                          )
                          .map((item: Service, index: number) => (
                            <RotatingCard
                              key={index}
                              content="service"
                              item={item}
                            />
                          ))}
                    </div>
                  </div>
                )
              )}
          </div>
          <div className="w-full flex items-center justify-center">
            <GoogleMap />
          </div>
        </div>
      )}
    </div>
  );
}
