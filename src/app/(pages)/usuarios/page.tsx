"use client";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/Context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/interfaces/User.interface";
import {
  serviceEditUserId,
  serviceGetAllUsers,
} from "@/services/users.service";
import LoadingSpinner from "@/shared/LoadingSpinner/LoadingSpinner";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Pagina = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const { authUser } = useAuthContext();
  const router = useRouter();
  const {toast} = useToast()

  useEffect(() => {
    console.log(authUser);
    const timer = setTimeout(() => {
      if (!authUser || authUser?.rol !== "admin") {
        router.push("/");
      }
    }, 2000);

    return () => clearTimeout(timer);
    //eslint-disable-next-line
  }, [authUser]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [responseUsers] = await Promise.all([serviceGetAllUsers()]);
        setUsers(responseUsers);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición", e);
        toast({
          description: "No se ha podido editar el usuario."
        })
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangeSelect = async (item: User, rol: string) => {
    try {
      let { ...userToEdit } = item;
      userToEdit.rol = rol;
      await serviceEditUserId(item.id, userToEdit);
    } catch (e) {
      console.error("Error al modificar usuario: ",e);
      toast({
        description: "No se ha podido modificar el usuario."
      })
    }
  };

  return (
    <div
      className={`w-screen flex justify-center flex-col items-center bg-[url('/background-image.png')] bg-bottom bg-no-repeat bg-[length:2000px_500px]`}
    >
      {loading && (
        <div className="flex justify-center items-center w-full h-full">
          <LoadingSpinner />
        </div>
      )}

      {users.length > 0 ? (
        <Card className="flex justify-center flex-col items-center w-full px-4 md:px-36 h-full bg-[url('/background-image.png')] bg-bottom bg-no-repeat bg-[length:2000px_500px]">
          <h2 className="text-2xl mt-4 w-full text-center font-semibold">
            Lista de usuarios
          </h2>
          {users.map((item: User, index: number) => (
            <Card
              key={index}
              className="flex justify-between gap-4 items-center w-full my-4 p-2 px-4 md:px-8"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-x-4">
                  {/* eslint-disable-next-line */}
                  <img
                    className="rounded-full w-[50px] h-[50px]"
                    src={item.avatar}
                    height={50}
                    width={50}
                  />
                  <p className="font-bold text-base md:text-lg pl-4">{item.username}</p>
                </div>
                <p className="font-light text-xs md:text-lg">Dirección:<span className="font-bold text-xs md:text-lg pl-4" >{item?.direccion}</span></p>
                <p className="font-light text-xs md:text-lg">Ciudad:<span className="font-bold text-xs md:text-lg pl-4" >{item?.ciudad}</span></p>
              </div>
              <Select
                onValueChange={(e) => {
                  handleChangeSelect(item, e);
                }}
                defaultValue={item.rol}
              >
                <SelectTrigger className="w-6/12 md:w-4/12">
                  <SelectValue placeholder="Seleccionar un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="usuario">Usuario</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Card>
          ))}
        </Card>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <p>No se han encontrado usuarios</p>
        </div>
      )}
    </div>
  );
};

export default Pagina;
