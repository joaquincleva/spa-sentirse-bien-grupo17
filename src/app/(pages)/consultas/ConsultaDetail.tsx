import React, { useState } from "react";
import { Consulta } from "@/interfaces/Consultas.interface";
import { User } from "@/interfaces/User.interface";
import { Card } from "@/components/ui/card";

interface ConsultaDetailProps {
  consulta: Consulta;
  usuario: User | undefined;
  authUser: User | null;
  onDelete: (id: string) => void;
  onAnswer: (id: string, respuesta: string) => void;
}

const ConsultaDetail: React.FC<ConsultaDetailProps> = ({
  consulta,
  usuario,
  authUser,
  onDelete,
  onAnswer,
}) => {
  const [respuesta, setRespuesta] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleSubmit = () => {
    onAnswer(consulta.id, respuesta);
    setRespuesta("")
    setIsEditing(false);
  };

  return (
    <Card className="p-5">
      <h2 className="text-xl font-bold mb-2">{consulta.titulo}</h2>
      <p className="mb-4">{consulta.contenido}</p>
      <p className="mb-2">
        <strong>Realizada por:</strong> {usuario?.username || "Anónimo"}
      </p>
      <p className="mb-4">
        <strong>Fecha:</strong>{" "}
        {new Date(consulta.publish_date.seconds * 1000).toLocaleDateString()}
      </p>

      {consulta.respuesta ? (
        <>
          <p className="mb-2">
            <strong>Respuesta:</strong> {consulta.respuesta}
          </p>
          <p className="mb-4">
            <strong>Fecha de respuesta:</strong>{" "}
            {consulta.publish_date_respuesta
              ? new Date(
                  consulta.publish_date_respuesta.seconds * 1000
                ).toLocaleDateString()
              : new Date().toLocaleDateString()}
          </p>
        </>
      ) : (
        <>
          {authUser &&
            (authUser.rol === "personal" || authUser.rol === "admin") && (
              <div className="mb-4">
                {isEditing ? (
                  <div>
                    <textarea
                      className="w-full p-2 border rounded"
                      value={respuesta}
                      onChange={(e) => setRespuesta(e.target.value)}
                      placeholder="Escribe tu respuesta aquí..."
                    ></textarea>
                    <button
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                      onClick={handleSubmit}
                    >
                      Enviar Respuesta
                    </button>
                    <button
                      className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => setIsEditing(true)}
                  >
                    Responder
                  </button>
                )}
              </div>
            )}
        </>
      )}

      {(authUser?.rol === "personal" || authUser?.rol === "admin") && (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => onDelete(consulta.id)}
        >
          Eliminar
        </button>
      )}
    </Card>
  );
};

export default ConsultaDetail;
