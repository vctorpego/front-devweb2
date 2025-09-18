import { Ator } from "./ator";
import { Classe } from "./classe";
import { Diretor } from "./diretor";

export interface Titulo {
    idTitulo: string;
    nome: string;
    atores: Array<Ator>;
    diretor: Diretor;
    ano: number;
    sinopse: string;
    categoria: string;
    classe: Classe;
  }
  
  export interface TituloCreate {
    nome: string;
    atores: Ator[];
    diretor: {id: string};
    ano: number;
    sinopse: string;
    categoria: string;
    classe: {id: string};
  }
  
  export interface TituloUpdate extends TituloCreate{
    idTitulo: string;
  }
  
  export type TitulosArray = Array<Titulo>