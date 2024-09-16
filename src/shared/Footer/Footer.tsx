"use client";
import LogoFlor from "@/../public/loto-flor.png";
import Facebook from "@/../public/facebook.png";
import Twitter from "@/../public/twitter.png";
import Instagram from "@/../public/instagram.png";
import Github from "@/../public/github.png";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Service } from "@/interfaces/Service.interface";
import { serviceGetAllServices } from "@/services/services.service";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { useAuthContext } from "@/Context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {authUser} = useAuthContext()
  const {toast} = useToast()


  useEffect(() => {
    const usersFetch: any = async () => {
      setLoading(true);
      try {
        const responseUsers = await serviceGetAllServices();
        setServices(responseUsers);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición");
        toast({
          description: "No se han podido obtener los servicios."
        })
      } finally {
        setLoading(false);
      }
    };
    usersFetch();
  }, []);

  return (
    <div className="shadow-sm flex flex-col md:flex-row items-start md:items-center justify-evenly py-4 gap-x-4 h-[300px]">
      <div className="hidden lg:flex flex-col p-10 justify-start items-center">
        <Image src={LogoFlor} alt="Logo SPA Sentirse bien" width={"100"} />
      </div>
      <div className="flex-col flex p-10 justify-start  items-start h-full">
        <h3 className="pb-5 text-lg font-bold text-gray-600">Contactanos</h3>
        <p className="font-light text-md text-gray-500">Av. Sarmiento 55</p>
        <p className="font-light text-md text-gray-500">Resistencia - Chaco</p>
        <Link target="blank" href={`mailto:spasentirsebien@spa.com.ar?subject=${encodeURIComponent("Consulta")}&body=${encodeURIComponent("¡Hola! Quiero realizar una consulta.")}`} className="font-light hover:underline text-md text-gray-500">Email: spasentirsebien@spa.com.ar</Link>
        <Link target="blank" href="https://wa.me/5493624000000?text=Bienvenido" className="font-light text-md hover:underline text-gray-500">Whatsapp: 3624000000</Link>
        <div className="flex justify-start w-full gap-4 pt-5">
          <a href="https://facebook.com"><Image src={Facebook} alt="Logo facebook"    width="40" /></a>
          <a href="https://x.com"><Image src={Twitter} alt="Logo Twitter"             width="40" /></a>
          <a href="https://github.com"><Image src={Github} alt="Logo Github"          width="40" /></a>
          <a href="https://instagram.com"><Image src={Instagram} alt="Logo Instagram" width="40" /></a>
        </div>
      </div>
      <div className="flex-col text-left flex p-10 justify-start items-start h-full">
        <h3 className="pb-5 text-lg font-bold text-slate-600">Enlaces Rápidos</h3>
        <Link href={"/"}          className="hover:underline font-light text-md text-gray-500">Home</Link>
        <Link href={"/noticias"}  className="hover:underline font-light text-md text-gray-500">Noticias</Link>
        <Link href={"/servicios"} className="hover:underline font-light text-md text-gray-500">Servicios</Link>
        <Link href={`${!authUser ? "/auth/login" : "/turnos"}`}    className="hover:underline font-light text-md text-gray-500">Reservar turnos</Link>
      </div>
      <div className="hidden md:flex w-1/3 flex-col p-10 text-left justify-start items-start h-full">
        <h3 className="pl-2 pb-5 text-lg font-bold text-slate-600">Imágenes</h3>
        {loading? <LoadingSpinner /> : (
          <div className="flex flex-wrap w-full">
            {services.length>0 && services.slice(0,6).map((item: Service, index: number)=> (
              // eslint-disable-next-line
              <img key={index} src={item.imagen} alt={item.nombre} className={`md:p-2 rounded-xl w-[100%] lg:w-[30%] ${index>=2 ? "md:hidden lg:block" : "" }`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;
