import React, { useState } from "react";

interface AddConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (titulo: string, contenido: string) => void;
}

const AddConsultaModal: React.FC<AddConsultaModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [titulo, setTitulo] = useState<string>("");
  const [contenido, setContenido] = useState<string>("");

  const handleSubmit = () => {
    onAdd(titulo, contenido);
    setTitulo("");
    setContenido("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-3/4 lg:w-1/3">
        <h2 className="text-xl font-bold mb-4">Agregar Nueva Consulta</h2>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          className="w-full p-2 border rounded mb-4"
          placeholder="Contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        ></textarea>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-500 text-white rounded mr-2" onClick={onClose}>
            Cancelar
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleSubmit}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddConsultaModal;