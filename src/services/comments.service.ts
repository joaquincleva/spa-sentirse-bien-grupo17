import {
  getFirestore,
  collection,
  query,
  doc,
  updateDoc,
  where,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { News } from "@/interfaces/News.interface";
import { Comment } from "@/interfaces/Comments.interface";

export const serviceGetComments = async (typeQuery: string, id: string) => {
  const comentariosRef = collection(db, "comentarios");
  const q =
    typeQuery === "servicio"
      ? query(comentariosRef, where("servicio_id", "==", id))
      : query(comentariosRef, where("noticia_id", "==", id));

  try {
    const querySnapshot = await getDocs(q);
    const comentarios: Comment[] = [];
    querySnapshot.forEach((doc) => {
      comentarios.push({ id: doc.id, ...doc.data() } as Comment);
    });
    return comentarios;
  } catch (error) {
    console.error("Error al recuperar comentarios: ", error);
    return [];
  }
};

export const serviceAddComment = async (
  comentario: Omit<Comment, "id">
): Promise<void> => {
  try {
    const comentariosRef = collection(db, "comentarios");
    await addDoc(comentariosRef, comentario);
  } catch (error) {
    console.error("Error al agregar comentario: ", error);
  }
};

export const serviceToggleLike = async (
  commentId: string,
  likes: number
): Promise<void> => {
  try {
    const commentRef = doc(db, "comentarios", commentId);
    await updateDoc(commentRef, {likes: likes,});
  } catch (error) {
    console.error("Error al actualizar likes: ", error);
  }
};
