export interface Classe{
    id: string;
    nome: string;
    valor: number;
    dataDevolucao: Date;
}

export interface ClasseCreate{
    nome: string;
    valor: number;
    dataDevolucao: Date;
}

export interface ClasseUpdate{
    id: string;
}

export type ClassesArray = Array<Classe>