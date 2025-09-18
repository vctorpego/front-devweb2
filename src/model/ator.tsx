export interface Ator{
    id: string;
    nome: string;
}

export interface AtorCreate{
    nome: string;
}

export interface AtorUpdate{
    id: string;
}

export type AtoresArray = Array<Ator>