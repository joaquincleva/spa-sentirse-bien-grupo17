import {
  getDoc,
  getDocs,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Turno } from "@/interfaces/Turnos.interface";

export const serviceGetAllTurnos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "turnos"));
    const users: Turno[] = [];
    querySnapshot.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id } as Turno);
    });
    return users;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
    return [];
  }
};

export const serviceGetTurnoById = async (id: string) => {
  try {
    const document = doc(db, "turnos", id);
    const response = await getDoc(document);
    const user = response.data() as Turno;
    return user;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
  }
};

export const serviceCreateTurno = async (user: Omit<Turno, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "turnos"), user);
    return docRef.id;
  } catch (e) {
    console.error("Error al pedir el turno: ", e);
    throw new Error("No se pudo crear el turno.");
  }
};

export const serviceDeleteTurno = async (id: string) => {
  try {
    const consultaRef = doc(db, "turnos", id);
    await deleteDoc(consultaRef);
    console.log(`Consulta con ID ${id} eliminada exitosamente.`);
  } catch (e) {
    console.error("Error al eliminar la consulta: ", e);
    throw e;
  }
};
