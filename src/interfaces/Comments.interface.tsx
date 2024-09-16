import { publish_date } from "./News.interface";

export interface Comment {
  id: string;
  contenido: string;
  likes: number;
  publish_date: publish_date;
  usuario_id?: string;
  servicio_id?: string;
  noticia_id?: string;
}
