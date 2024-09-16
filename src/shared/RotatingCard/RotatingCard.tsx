import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { News } from "@/interfaces/News.interface";
import { Service } from "@/interfaces/Service.interface";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface RotatingCardProps {
  item: News | Service;
  content: string;
}

const RotatingCard: React.FC<RotatingCardProps> = ({ item, content }) => {
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });
  const router = useRouter();
  const handleMouseMove = (e: any) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (y / rect.height) * -35;
    const rotateY = (x / rect.width) * 35;

    setRotation({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      className="w-full md:w-1/2 lg:w-1/4 p-5 hover:cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        router.push(
          "publish_date" in item
            ? `/noticias/${item.id}`
            : `/servicios/${item.id}`
        );
      }}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
        transition: "transform 0s",
      }}
    >
      <Card className="hover:bg-gradient-to-b hover:from-red-100 hover:to-green-50 h-full">
        <CardHeader>
          {"publish_date" in item && (
            <p className="w-full text-end text-sm text-gray-400">
              {new Date(item.publish_date.seconds * 1000).toLocaleDateString(
                "es-ES",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          )}
          {/* eslint-disable-next-line */}
          <img
            className="rounded h-36"
            src={item.imagen}
            alt={"titulo" in item ? item.titulo : item.nombre}
          />
          <CardTitle className="text-center py-3">
            {"titulo" in item ? item.titulo : item.nombre}
          </CardTitle>
          <CardDescription>
            {"contenido" in item
              ? item.contenido.length > 139
                ? item.contenido.slice(0, 140) + "..."
                : item.contenido
              : item?.descripcion.length > 139
              ? item?.descripcion.slice(0, 140) + "..."
              : item?.descripcion}
          </CardDescription>
          {"precio" in item && (
            <p className="absolute left-5 w-1/4 top-[25px] text-sm text-white py-1 text-center rounded-e-md bg-orange-400">
              ${item.precio.toLocaleString(undefined, {})}
            </p>
          )}
        </CardHeader>
      </Card>
    </div>
  );
};

export default RotatingCard;
