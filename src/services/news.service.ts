import { getDoc, getDocs, collection, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { News } from "@/interfaces/News.interface";

export const serviceGetAllNews = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "noticias"));
    const allNews: News[] = [];
    querySnapshot.forEach((doc) => {
      allNews.push({ ...doc.data(), id: doc.id } as News);
    });
    console.table(allNews);
    return allNews;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
    return [];
  }
};

export const serviceGetNewsById = async (id: string) => {
  try {
    const document = doc(db, "noticias", id);
    const response = await getDoc(document);
    const news = {...response.data() as News, id: id};
    return news;
  } catch (e) {
    console.error("Hubo un error en la petición: ", e);
  }
};

export const serviceEditNewsId = async (id: string, updatedNews: Partial<Omit<News, 'id'>>) => {
  try {
    const serviceRef = doc(db, "noticias", id);
    await updateDoc(serviceRef, updatedNews);
    return true;
  } catch (e) {
    console.error("Error al editar la noticia: ", e);
    throw new Error("No se pudo editar la noticia.");
  }
};

export const serviceCreateNews = async (
  news: Omit<News, "id">
): Promise<void> => {
  try {
    const newsRef = collection(db, "noticias");
    await addDoc(newsRef, news);
  } catch (error) {
    console.error("Error al agregar noticia: ", error);
  }
};

