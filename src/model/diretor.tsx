export interface Diretor{
    id: string;
    nome: string;
}

export interface DiretorCreate{
    nome: string;
}

export interface DiretorUpdate{
    id: string;
}

export type DiretoresArray = Array<Diretor>