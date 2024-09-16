import { getDoc, getDocs, collection, addDoc, deleteDoc, updateDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Consulta } from "@/interfaces/Consultas.interface";

export const serviceGetAllConsultas = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "consultas"));
    const allConsultas: Consulta[] = [];
    querySnapshot.forEach((doc) => {
      allConsultas.push({ ...doc.data(), id: doc.id } as Consulta);
    });
    console.table(allConsultas);
    return allConsultas;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
    return [];
  }
};

export const serviceDeleteConsulta = async (id: string): Promise<void> => {
  try {
    const consultaRef = doc(db, "consultas", id);
    await deleteDoc(consultaRef);
  } catch (e) {
    console.error("Error al eliminar la consulta: ", e);
    throw e;
  }
};
export const serviceAnswerConsulta = async (id: string, respuesta: string, usuario_respuesta: string): Promise<void> => {
  try {
    const consultaRef = doc(db, "consultas", id);
    await updateDoc(consultaRef, {
      respuesta,
      publish_date_respuesta: serverTimestamp(),
      usuario_respuesta,
    });
  } catch (e) {
    console.error("Error al responder la consulta: ", e);
    throw e;
  }
};

export const serviceGetConsultaById = async (id: string) => {
  try {
    const document = doc(db, "consultas", id);
    const response = await getDoc(document);
    const consulta = response.data() as Consulta;
    return consulta;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
  }
};

export const serviceAddConsulta = async (contenido: string, titulo: string, usuario_id: string, username: string): Promise<void> => {
  try {
    const consultasCollection = collection(db, "consultas");
    await addDoc(consultasCollection, {
      contenido,
      titulo,
      usuario_id,
      username,
      publish_date: serverTimestamp(),
      respuesta: "",
      publish_date_respuesta: null,
      usuario_respuesta: "",
    });
  } catch (e) {
    console.error("Error al agregar la consulta: ", e);
    throw e;
  }
};