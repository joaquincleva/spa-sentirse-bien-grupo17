import { getDoc, getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Service } from "@/interfaces/Service.interface";

export const serviceGetAllServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "servicios"));
    const services: Service[] = [];
    querySnapshot.forEach((doc) => {
      services.push({...doc.data(), id: doc.id} as Service);
    });
    return services;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
    return [];
  }
};

export const serviceGetServiceById = async (id: string) => {
  try {
    const document = doc(db, "servicios", id);
    const response = await getDoc(document);
    const service = {...response.data() as Service, id: id};
    return service;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
  }
};

export const serviceEditServiceId = async (id: string, updatedService: Partial<Omit<Service, 'id'>>) => {
  try {
    const serviceRef = doc(db, "servicios", id);
    await updateDoc(serviceRef, updatedService);
    return true;
  } catch (e) {
    console.error("Error al editar el servicio: ", e);
    throw new Error("No se pudo editar el servicio.");
  }
};
