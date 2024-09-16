import { getDoc, getDocs, collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { User } from "@/interfaces/User.interface";

export const serviceGetAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push({...doc.data(), id: doc.id } as User);
    });
    return users;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
    return [];
  }
};

export const serviceGetUserById = async (id: string) => {
  try {
    const document = doc(db, "usuarios", id);
    const response = await getDoc(document);
    const user = response.data() as User;
    return user;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
  }
};

export const serviceCreateUser = async (user: Omit<User, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, "usuarios"), user);
    return docRef.id;
  } catch (e) {
    console.error("Error al crear el usuario: ", e);
    throw new Error("No se pudo crear el usuario.");
  }
};

export const serviceEditUserId = async (id: string, updatedUser: Partial<Omit<User, 'id'>>) => {
  try {
    const userRef = doc(db, "usuarios", id);
    await updateDoc(userRef, updatedUser);
    return true;
  } catch (e) {
    console.error("Error al editar el usuario: ", e);
    throw new Error("No se pudo editar el usuario.");
  }
};