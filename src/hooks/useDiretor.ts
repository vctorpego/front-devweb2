import { Diretor, DiretorCreate, DiretoresArray, DiretorUpdate } from "@/model/diretor";
import api from "@/lib/api";
import { useState } from "react";

export const useDiretorHook = () => {
    const [diretor, setDiretor ] = useState<Diretor | null> (null);
    const [diretores, setDiretores] = useState<DiretoresArray | null>(null);

    const criarDiretor = async (diretor: DiretorCreate): Promise<void> => {
        const response = await api.post('diretor/criar', diretor);
        return response.data;
    };

    const editarDiretor = async ( diretor: DiretorUpdate): Promise<DiretorUpdate> => {
        const response = await api.put(`diretor/editar/${diretor.id}`, diretor);
        return response.data;
    }

    const deletarDiretor = async (diretorId: string): Promise<void> => {
        const response = await api.delete(`diretor/deletar/${diretorId}`);
        return response.data;
    }

    const listarDiretores = async () => {
        const response = await api.get(`diretor/listar`);
        if (response.data) {
            setDiretores(response.data);
        }
    }

    const selecionarDiretor = async (diretorId: string) => {
        const response = await api.get(`diretor/listar/${diretorId}`);
        if (response.data) {
            setDiretor(response.data);
        }
    }

    return {criarDiretor, deletarDiretor, editarDiretor, listarDiretores, selecionarDiretor,diretor, diretores}
}