import { Titulo } from "./titulo";

export interface Item {
  id: string;
  numSerie: string;
  titulo: Titulo;
  dtAquisicao: Date;
  tipoItem: string;
}

export interface ItemCreate {
  numSerie: string;
  titulo: { idTitulo: string };
  dtAquisicao: Date;
  tipoItem: string;
}

export interface ItemUpdate extends ItemCreate {
  id: string;
}

export type ItensArray = Array<Item>;