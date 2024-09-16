import { getDocs, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ServiceCategories } from "@/interfaces/ServiceCategories.interface";

export const serviceGetAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "categoria_servicio"));
    const categories: (ServiceCategories & { id: string })[] = [];
    querySnapshot.forEach((doc) => {
      categories.push({ ...doc.data(), id: doc.id } as ServiceCategories);
    });
    return categories;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
    return [];
  }
};
