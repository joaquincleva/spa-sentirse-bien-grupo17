export interface publish_date {
  seconds: number;
  nanoseconds: number;
}

export interface News {
  contenido: string;
  imagen: string;
  titulo: string;
  id: string;
  publish_date: publish_date;
}
