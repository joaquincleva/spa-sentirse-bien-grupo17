"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Consulta } from "@/interfaces/Consultas.interface";
import {
  serviceGetAllConsultas,
  serviceDeleteConsulta,
  serviceAnswerConsulta,
  serviceAddConsulta,
} from "@/services/consultas.service";
import LoadingSpinner from "@/shared/LoadingSpinner/LoadingSpinner";
import { User } from "@/interfaces/User.interface";
import { useAuthContext } from "@/Context/AuthContext";
import { serviceGetAllUsers } from "@/services/users.service";
import ConsultaList from "./ConsultaLista";
import ConsultaDetail from "./ConsultaDetail";
import AddConsultaModal from "./AddConsultaModal";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const { authUser } = useAuthContext();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filterRespondidas, setFilterRespondidas] = useState<boolean | null>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterText, setFilterText ] = useState<string>("")
  const {toast} = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [responseConsultas, responseUsers] = await Promise.all([
          serviceGetAllConsultas(),
          serviceGetAllUsers(),
        ]);
        setConsultas(responseConsultas);
        setUsers(responseUsers);
      } catch (e) {
        console.error("Ha ocurrido un error en la petición", e);
        toast({
          description: "No se han podido obtener los usuarios o consultas."
        })
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteConsulta = async (id: string) => {
    try {
      await serviceDeleteConsulta(id);
      setConsultas(consultas.filter((consulta) => consulta.id !== id));
      if (selectedConsulta?.id === id) {
        setSelectedConsulta(null);
      }
    } catch (e) {
      console.error("Error al eliminar la consulta: ", e);
      
      toast({
        description: "No se ha podido eliminar la consulta."
      })
    }
  };

  const handleAnswerConsulta = async (id: string, respuesta: string) => {
    if (!authUser) return;
    try {
      await serviceAnswerConsulta(id, respuesta, authUser.id);
      setConsultas(
        consultas.map((consulta) =>
          consulta.id === id ? { ...consulta, respuesta } : consulta
        )
      );
      if (selectedConsulta?.id === id) {
        setSelectedConsulta({ ...selectedConsulta, respuesta });
      }
    } catch (e) {
      console.error("Error al responder la consulta: ", e);
      toast({
        description: "No se ha podido responder la consulta."
      })
    }
  };

  const handleAddConsulta = async (titulo: string, contenido: string) => {
    try {
      await serviceAddConsulta(contenido, titulo, authUser?.id ?? "", authUser?.username?? "");
      const newConsulta = await serviceGetAllConsultas();
      setConsultas(newConsulta);
    } catch (e) {
      console.error("Error al agregar la consulta: ", e);
      toast({
        description: "No se ha podido agregar la consulta."
      })
    }
  };

  const getUsuarioById = (id: string): User | undefined => {
    return users.find((user) => user.id === id);
  };

  return (
    <div className=" w-full md:w-screen h-full md:h-screen flex mb-10">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="w-full md:w-1/3 bg-white p-4 overflow-y-auto border-r">
            <h2 className="text-2xl font-semibold mb-4">Consultas</h2>
            <Input
              className="w-full mb-4"
              size={2}
              value={filterText}
              placeholder="Filtrar consultas"
              onChange={(e) =>
                setFilterText(e.target.value)
              }
            />
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filterRespondidas === false}
                  onChange={(e) =>
                    setFilterRespondidas(e.target.checked ? false : null)
                  }
                />
                <span className="ml-2">Mostrar solo no respondidas</span>
              </label>
            </div>
            <ConsultaList
            selectedConsulta={selectedConsulta}
            filterText={filterText}
              consultas={consultas}
              filterRespondidas={filterRespondidas}
              onSelectConsulta={(consulta:any) => setSelectedConsulta(consulta)}
            />
            {(!authUser || authUser.rol === "usuario") && (
              <button
                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Agregar Consulta
              </button>
            )}
          </div>

          <div className="w-full md:w-2/3 p-4 overflow-y-auto">
            {selectedConsulta ? (
              <ConsultaDetail
                consulta={selectedConsulta}
                usuario={getUsuarioById(selectedConsulta.usuario_id)}
                authUser={authUser}
                onDelete={handleDeleteConsulta}
                onAnswer={handleAnswerConsulta}
              />
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500">
                Selecciona una consulta para ver los detalles.
              </div>
            )}
          </div>

          <AddConsultaModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddConsulta}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
