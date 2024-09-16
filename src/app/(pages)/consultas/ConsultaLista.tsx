import React from "react";
import { Consulta } from "@/interfaces/Consultas.interface";

interface ConsultaListProps {
  consultas: Consulta[];
  filterRespondidas: boolean | null;
  filterText: string;
  selectedConsulta: Consulta | null;
  onSelectConsulta: (consulta: Consulta) => void;
}

const ConsultaList: React.FC<ConsultaListProps> = ({ consultas, filterRespondidas, filterText, selectedConsulta, onSelectConsulta }) => {
  const filteredConsultas = consultas.filter(consulta => 
    consulta.contenido.toLowerCase().includes(filterText.toLocaleLowerCase()) || consulta.titulo.toLowerCase().includes(filterText.toLocaleLowerCase())
  ).filter((consulta) =>
    filterRespondidas === null? true
      : filterRespondidas? consulta.respuesta !== ""
      : consulta.respuesta === ""
  );

  return (
    <div className="w-full">
      {filteredConsultas.map((consulta) => (
        <div
          key={consulta.id}
          className="p-4 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectConsulta(consulta)}
        >
          <h3 className="font-semibold">{consulta.titulo}</h3>
          <p className="text-sm text-gray-600">
            Fecha: {new Date(consulta.publish_date.seconds * 1000).toLocaleDateString()} -{" "}
            {consulta.respuesta ? "Respondida" : "No respondida"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ConsultaList;