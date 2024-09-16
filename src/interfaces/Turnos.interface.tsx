import { publish_date } from "./News.interface";

export interface Turno {
  id: string;
  fecha: publish_date;
  usuario_id: string;
  servicio_id: string;
}
