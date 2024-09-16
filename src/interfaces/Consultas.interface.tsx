import { publish_date } from "./News.interface";

export interface Consulta {
  id: string;
  contenido: string;
  publish_date: publish_date;
  publish_date_respuesta: publish_date;
  respuesta: string;
  titulo: string;
  usuario_id: string;
  usuario_respuesta: string;
}
