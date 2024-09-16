"use client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React, { useState } from "react";
import Facebook from "@/../public/facebook.png";
import Linkedin from "@/../public/linkedin.png";
import Github from "@/../public/github.png";
import { Separator } from "@/components/ui/separator";

const Page = () => {

    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    const miembros = [
        {nombre: "Martín Joel Soto", rol: "Front-End", imagen: "../../../../martin.png", descripcion: "Martín es un estudiante de la Tecnicatura Universitaria en Programación en la UTN, enfocado en fortalecer sus habilidades en el desarrollo front-end. Con una base sólida en los principios de diseño web y la programación en HTML y CSS, Martín está aprendiendo JavaScript y planea especializarse en frameworks modernos. Aunque es un aprendiz, su dedicación y curiosidad lo impulsan a experimentar con nuevas tecnologías y a seguir creciendo en el campo del desarrollo web.", facebook: "https://www.facebook.com/ColoAS", github: "https://github.com/MartinSoto", linkedin: "https://www.linkedin.com/in/pablo-martin-soto-4672198/"},
        {nombre: "Pedro Ríos Gómez", rol: "Front-End", imagen: "../../../../pedro.png", descripcion: "Pedro es un estudiante de la Tecnicatura Universitaria en Programación de la UTN, donde ha desarrollado un fuerte interés en el desarrollo front-end. Aunque todavía está en proceso de aprendizaje, Pedro ya ha adquirido conocimientos en HTML, CSS y JavaScript, y está comenzando a explorar frameworks como React. Con una pasión por el diseño y la interactividad, Pedro está comprometido en mejorar sus habilidades para crear interfaces de usuario atractivas y funcionales.", facebook: "https://www.facebook.com/profile.php?id=1721036867", github: "https://github.com/pedrovgs", linkedin: "https://www.linkedin.com/in/pedro-augusto-gomez/"},
        {nombre: "Joaquín Cleva", rol: "Front-End", imagen: "../../../../joaquin.png", descripcion: "Joaquín está cursando la Tecnicatura Universitaria en Programación en la UTN, y ha mostrado un gran interés en el desarrollo front-end. Aún en formación, Joaquín está adquiriendo conocimientos esenciales en HTML, CSS y JavaScript. Le entusiasma la idea de crear interfaces de usuario dinámicas y está ansioso por aprender sobre frameworks y herramientas avanzadas que lo ayuden a convertirse en un desarrollador front-end competente en el futuro.", facebook: "https://www.facebook.com/profile.php?id=100070565091301", github: "https://github.com/joaquin", linkedin: "https://www.linkedin.com/in/joaqu%C3%ADn-i%C3%B1urrategui/"}
    ]

  return (
    <div
      className={`w-screen mt-10 flex justify-center flex-col items-center bg-[url('/background-image.png')] bg-bottom bg-no-repeat bg-[length:2000px_500px]`}
    >
      <h5 className="uppercase text-gray-400 text-md">Nuestro equipo</h5>
      <h3 className="text-black mb-10 text-2xl font-bold">Miembros</h3>
      <div className="w-full md:w-3/4 px-10 flex justify-center gap-10">
        {miembros.map((item: any, index:number)=> (
            <div onClick={()=>{setSelectedIndex(index)}} key={index} className="flex flex-col text-center justify-center items-center cursor-pointer">
                {/* eslint-disable-next-line */}
                <img src={item.imagen} alt={item.nombre} className="w-20 md:w-28 h-20 md:h-28 rounded-full mb-4" />
                <p className="font-extrabold font-lg">{item.nombre}</p>
                <p className="font-extrabold font-lg text-orange-500">{item.rol}</p>
            </div>
        ))}
      </div>
      <Card className="w-3/4 mx-10 flex lg:flex-row flex-col-reverse bg-gray-50 my-10">
        <div className="w-full lg:w-7/12 flex flex-col lg:items-start items-center justify-center px-10 py-10">
            <h3 className="text-2xl pb-10 font-bold">{miembros[selectedIndex].nombre}</h3>
            <p className="text-md text-justify font-light">{miembros[selectedIndex].descripcion}</p>
            <div className="flex self-center gap-x-5 pt-5">
                <a href={miembros[selectedIndex].linkedin}><Image src={Linkedin} alt="Logo Linkedin"             width="40" /></a>
                <Separator orientation="vertical" className="border-[1.5px] border-black" />
                <a href={miembros[selectedIndex].github}><Image src={Github} alt="Logo Github"          width="40" /></a>
                <Separator orientation="vertical" className="border-[1.5px] border-black" />
                <a href={miembros[selectedIndex].facebook}><Image src={Facebook} alt="Logo facebook"    width="40" /></a>
            </div>
        </div>
        <div className="w-full lg:w-5/12">
            {/* eslint-disable-next-line */}
            <img src={miembros[selectedIndex].imagen} alt={miembros[selectedIndex].nombre} className="w-full h-full rounded-t-lg lg:rounded-t-none lg:rounded-r-lg mb-4" />
        </div>
      </Card>
    </div>
  );
};

export default Page;
